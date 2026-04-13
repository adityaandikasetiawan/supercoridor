import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import initSqlJs from 'sql.js';
import { createRequire } from 'node:module';

const app = express();

const PORT = Number(process.env.PORT ?? 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? FRONTEND_ORIGIN)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? null;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? null;

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'admin@supercorridor.com').trim().toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? null;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? null;

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

const failedLoginState = new Map();

const AUTH_STORE_PATH = process.env.AUTH_STORE_PATH ?? path.join(os.tmpdir(), 'supercorridor-auth-store.json');
const CONTENT_STORE_PATH =
  process.env.CONTENT_STORE_PATH ?? path.join(os.tmpdir(), 'supercorridor-content-store.json');
const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH ?? path.join(os.tmpdir(), 'supercorridor.sqlite');

function nowMs() {
  return Date.now();
}

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function assertProductionConfig() {
  if (!isProd()) return;
  if (!ACCESS_TOKEN_SECRET || ACCESS_TOKEN_SECRET.length < 32) {
    throw new Error('ACCESS_TOKEN_SECRET must be set and at least 32 characters in production');
  }
  if (!REFRESH_TOKEN_SECRET || REFRESH_TOKEN_SECRET.length < 32) {
    throw new Error('REFRESH_TOKEN_SECRET must be set and at least 32 characters in production');
  }
  if (!ADMIN_PASSWORD_HASH) {
    throw new Error('ADMIN_PASSWORD_HASH must be set in production');
  }
}

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd(),
    maxAge: maxAgeMs,
    path: '/',
  };
}

function csrfCookieOptions(maxAgeMs) {
  return {
    httpOnly: false,
    sameSite: 'lax',
    secure: isProd(),
    maxAge: maxAgeMs,
    path: '/',
  };
}

function sha256Base64Url(value) {
  return crypto.createHash('sha256').update(value).digest('base64url');
}

let storeWriteQueue = Promise.resolve();
async function withStoreWrite(fn) {
  storeWriteQueue = storeWriteQueue.then(fn, fn);
  return storeWriteQueue;
}

let sqlDbInitPromise = null;
async function getSqlDb() {
  if (sqlDbInitPromise) return sqlDbInitPromise;
  sqlDbInitPromise = (async () => {
    const require = createRequire(import.meta.url);
    const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');
    const SQL = await initSqlJs({
      locateFile() {
        return wasmPath;
      },
    });

    let existing = null;
    try {
      existing = await fs.readFile(SQLITE_DB_PATH);
    } catch {
      existing = null;
    }

    const db = existing ? new SQL.Database(new Uint8Array(existing)) : new SQL.Database();
    db.run(
      'CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL, updatedAt INTEGER NOT NULL)'
    );

    const existingAuth = kvGet(db, 'authStore');
    if (!existingAuth) {
      try {
        const raw = await fs.readFile(AUTH_STORE_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          kvSet(db, 'authStore', JSON.stringify(parsed), nowMs());
        }
      } catch {}
    }

    const existingContent = kvGet(db, 'contentStore');
    if (!existingContent) {
      try {
        const raw = await fs.readFile(CONTENT_STORE_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          kvSet(db, 'contentStore', JSON.stringify(parsed), nowMs());
        }
      } catch {}
    }

    await persistSqlDb(db);
    return db;
  })();
  return sqlDbInitPromise;
}

function kvGet(db, key) {
  const stmt = db.prepare('SELECT value FROM kv WHERE key = ?');
  stmt.bind([key]);
  try {
    if (!stmt.step()) return null;
    const row = stmt.getAsObject();
    return typeof row.value === 'string' ? row.value : null;
  } finally {
    stmt.free();
  }
}

function kvSet(db, key, value, updatedAtMs) {
  db.run(
    'INSERT INTO kv(key, value, updatedAt) VALUES(?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updatedAt=excluded.updatedAt',
    [key, value, updatedAtMs]
  );
}

async function persistSqlDb(db) {
  const bytes = db.export();
  await fs.mkdir(path.dirname(SQLITE_DB_PATH), { recursive: true });
  await fs.writeFile(SQLITE_DB_PATH, Buffer.from(bytes));
}

async function readStore() {
  try {
    const db = await getSqlDb();
    const raw = kvGet(db, 'authStore');
    if (!raw) return { refreshTokens: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { refreshTokens: {} };
    if (!parsed.refreshTokens || typeof parsed.refreshTokens !== 'object') return { refreshTokens: {} };
    return { refreshTokens: parsed.refreshTokens };
  } catch {
    return { refreshTokens: {} };
  }
}

async function writeStore(next) {
  const db = await getSqlDb();
  kvSet(db, 'authStore', JSON.stringify(next), nowMs());
  await persistSqlDb(db);
}

async function revokeAllRefreshTokensForUser(userId) {
  await withStoreWrite(async () => {
    const store = await readStore();
    const now = nowMs();
    for (const [jti, entry] of Object.entries(store.refreshTokens)) {
      if (entry && entry.userId === userId && !entry.revokedAt) {
        store.refreshTokens[jti] = { ...entry, revokedAt: now };
      }
    }
    await writeStore(store);
  });
}

let contentWriteQueue = Promise.resolve();
async function withContentWrite(fn) {
  contentWriteQueue = contentWriteQueue.then(fn, fn);
  return contentWriteQueue;
}

async function readContentStore() {
  try {
    const db = await getSqlDb();
    const raw = kvGet(db, 'contentStore');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

async function writeContentStore(next) {
  const db = await getSqlDb();
  kvSet(db, 'contentStore', JSON.stringify(next), nowMs());
  await persistSqlDb(db);
}

function defaultTGCSData() {
  return {
    hero: {
      title: 'SuperCorridor TGCS',
      subtitle: 'Trans Gunung Cyber Subsea Cable System',
      description:
        "A state-of-the-art submarine cable system connecting strategic locations across Indonesia with world-class reliability and capacity.",
      enabled: true,
    },
    statistics: {
      cableLength: '1,200+ KM',
      fiberPairs: '12',
      capacity: '40 Tbps',
      rfsSchedule: 'Q2 2025',
    },
  };
}

function defaultHeroSlides() {
  return [
    {
      id: 1,
      title: 'Empowering Business Connectivity',
      subtitle: 'Across Indonesia',
      description: 'Enterprise-grade internet solutions with 99.99% uptime guarantee',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
      order: 1,
    },
    {
      id: 2,
      title: 'Ultra-Fast Fiber Network',
      subtitle: 'Nationwide Coverage',
      description: 'Connect your business with speeds up to 100Gbps',
      ctaText: 'Explore Solutions',
      ctaLink: '/solutions/dedicated-connectivity',
      backgroundImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80',
      order: 2,
    },
    {
      id: 3,
      title: 'Enterprise Security',
      subtitle: '24/7 Protection',
      description: 'Advanced DDoS protection and network monitoring',
      ctaText: 'Learn More',
      ctaLink: '/solutions/value-added-services',
      backgroundImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80',
      order: 3,
    },
  ];
}

function defaultResourcesInsights() {
  return [
    {
      id: '1',
      title: '5G Technology and the Future of Business Connectivity',
      excerpt: 'Explore how 5G is transforming business operations',
      content: 'Full article content here...',
      author: 'John Doe',
      date: '2024-01-15',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      published: true,
    },
    {
      id: '2',
      title: 'The Importance of Network Security in 2024',
      excerpt: 'Understanding modern security challenges',
      content: 'Full article content here...',
      author: 'Jane Smith',
      date: '2024-01-10',
      category: 'Security',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
      published: true,
    },
  ];
}

function defaultResourcesCaseStudies() {
  return [
    {
      id: '1',
      title: 'Enterprise Network Transformation',
      client: 'Global Tech Corp',
      industry: 'Technology',
      challenge: 'Legacy infrastructure causing downtime',
      solution: 'Deployed fiber optic backbone with redundancy',
      results: '99.99% uptime, 50% cost reduction',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      published: true,
    },
  ];
}

function defaultResourcesFAQ() {
  return [
    {
      id: '1',
      question: 'What is the typical installation time?',
      answer: 'Installation typically takes 5-10 business days depending on location and service type.',
      category: 'General',
      order: 1,
      published: true,
    },
    {
      id: '2',
      question: 'Do you offer 24/7 support?',
      answer: 'Yes, we provide round-the-clock technical support for all enterprise customers.',
      category: 'Support',
      order: 2,
      published: true,
    },
    {
      id: '3',
      question: 'What are your SLA guarantees?',
      answer: 'We guarantee 99.99% uptime for enterprise services with proactive monitoring.',
      category: 'Technical',
      order: 3,
      published: true,
    },
  ];
}

function defaultCareersJobs() {
  return [
    {
      id: '1',
      title: 'Network Engineer',
      department: 'Engineering',
      location: 'Jakarta, Indonesia',
      type: 'Full-time',
      description: 'We are looking for an experienced Network Engineer...',
      requirements: ['5+ years experience', 'CCNP certification', 'Strong TCP/IP knowledge'],
      responsibilities: ['Design and implement network solutions', 'Monitor network performance', 'Troubleshoot connectivity issues'],
      salary: 'IDR 15-25 million',
      posted: '2024-01-15',
      active: true,
    },
    {
      id: '2',
      title: 'Sales Manager',
      department: 'Sales',
      location: 'Surabaya, Indonesia',
      type: 'Full-time',
      description: 'Seeking a dynamic Sales Manager to lead our team...',
      requirements: ['7+ years in B2B sales', 'Leadership experience', 'Excellent communication'],
      responsibilities: ['Lead sales team', 'Develop business strategies', 'Manage client relationships'],
      salary: 'IDR 20-30 million',
      posted: '2024-01-10',
      active: true,
    },
  ];
}

function defaultCareersApplications() {
  return [
    {
      id: '1',
      applicantName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+62 812 3456 7890',
      location: 'Jakarta, Indonesia',
      jobTitle: 'Network Engineer',
      jobId: '1',
      appliedDate: '2024-01-20',
      resumeUrl: '#',
      coverLetter: 'I am writing to express my strong interest in the Network Engineer position...',
      status: 'new',
      experience: '5 years',
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+62 813 9876 5432',
      location: 'Surabaya, Indonesia',
      jobTitle: 'Sales Manager',
      jobId: '2',
      appliedDate: '2024-01-19',
      resumeUrl: '#',
      coverLetter: 'With over 7 years of experience in B2B sales, I am excited to apply...',
      status: 'reviewed',
      experience: '7 years',
    },
    {
      id: '3',
      applicantName: 'Ahmad Rahman',
      email: 'ahmad.rahman@email.com',
      phone: '+62 815 1234 5678',
      location: 'Bandung, Indonesia',
      jobTitle: 'Network Engineer',
      jobId: '1',
      appliedDate: '2024-01-18',
      resumeUrl: '#',
      coverLetter: 'I am passionate about network infrastructure and would love to contribute...',
      status: 'shortlisted',
      experience: '6 years',
    },
  ];
}

function validateTGCSData(input) {
  if (!input || typeof input !== 'object') return null;
  const hero = input.hero;
  const statistics = input.statistics;
  if (!hero || typeof hero !== 'object') return null;
  if (!statistics || typeof statistics !== 'object') return null;

  const title = typeof hero.title === 'string' ? hero.title : null;
  const subtitle = typeof hero.subtitle === 'string' ? hero.subtitle : null;
  const description = typeof hero.description === 'string' ? hero.description : null;
  const enabled = typeof hero.enabled === 'boolean' ? hero.enabled : null;

  const cableLength = typeof statistics.cableLength === 'string' ? statistics.cableLength : null;
  const fiberPairs = typeof statistics.fiberPairs === 'string' ? statistics.fiberPairs : null;
  const capacity = typeof statistics.capacity === 'string' ? statistics.capacity : null;
  const rfsSchedule = typeof statistics.rfsSchedule === 'string' ? statistics.rfsSchedule : null;

  if (!title || !subtitle || !description || enabled === null) return null;
  if (!cableLength || !fiberPairs || !capacity || !rfsSchedule) return null;

  return {
    hero: { title, subtitle, description, enabled },
    statistics: { cableLength, fiberPairs, capacity, rfsSchedule },
  };
}

function validateHeroSlides(input) {
  if (!Array.isArray(input)) return null;
  if (input.length < 1 || input.length > 10) return null;

  const slides = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'number' ? item.id : null;
    const order = typeof item.order === 'number' ? item.order : null;
    const title = typeof item.title === 'string' ? item.title : null;
    const subtitle = typeof item.subtitle === 'string' ? item.subtitle : null;
    const description = typeof item.description === 'string' ? item.description : null;
    const ctaText = typeof item.ctaText === 'string' ? item.ctaText : null;
    const ctaLink = typeof item.ctaLink === 'string' ? item.ctaLink : null;
    const backgroundImage = typeof item.backgroundImage === 'string' ? item.backgroundImage : null;
    if (
      id === null ||
      order === null ||
      !title ||
      !subtitle ||
      !description ||
      !ctaText ||
      !ctaLink ||
      !backgroundImage
    ) {
      return null;
    }
    slides.push({ id, order, title, subtitle, description, ctaText, ctaLink, backgroundImage });
  }

  slides.sort((a, b) => a.order - b.order);
  return slides;
}

function validateResourcesInsights(input) {
  if (!Array.isArray(input)) return null;
  if (input.length > 500) return null;
  const next = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'string' ? item.id : null;
    const title = typeof item.title === 'string' ? item.title : null;
    const excerpt = typeof item.excerpt === 'string' ? item.excerpt : null;
    const content = typeof item.content === 'string' ? item.content : null;
    const author = typeof item.author === 'string' ? item.author : null;
    const date = typeof item.date === 'string' ? item.date : null;
    const category = typeof item.category === 'string' ? item.category : null;
    const image = typeof item.image === 'string' ? item.image : null;
    const published = typeof item.published === 'boolean' ? item.published : null;
    if (!id || !title || !excerpt || content === null || !author || !date || !category || !image || published === null) {
      return null;
    }
    next.push({ id, title, excerpt, content, author, date, category, image, published });
  }
  return next;
}

function validateResourcesCaseStudies(input) {
  if (!Array.isArray(input)) return null;
  if (input.length > 500) return null;
  const next = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'string' ? item.id : null;
    const title = typeof item.title === 'string' ? item.title : null;
    const client = typeof item.client === 'string' ? item.client : null;
    const industry = typeof item.industry === 'string' ? item.industry : null;
    const challenge = typeof item.challenge === 'string' ? item.challenge : null;
    const solution = typeof item.solution === 'string' ? item.solution : null;
    const results = typeof item.results === 'string' ? item.results : null;
    const image = typeof item.image === 'string' ? item.image : null;
    const published = typeof item.published === 'boolean' ? item.published : null;
    if (!id || !title || !client || !industry || !challenge || !solution || !results || !image || published === null) {
      return null;
    }
    next.push({ id, title, client, industry, challenge, solution, results, image, published });
  }
  return next;
}

function validateResourcesFAQ(input) {
  if (!Array.isArray(input)) return null;
  if (input.length > 1000) return null;
  const next = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'string' ? item.id : null;
    const question = typeof item.question === 'string' ? item.question : null;
    const answer = typeof item.answer === 'string' ? item.answer : null;
    const category = typeof item.category === 'string' ? item.category : null;
    const order = typeof item.order === 'number' ? item.order : null;
    const published = typeof item.published === 'boolean' ? item.published : null;
    if (!id || !question || !answer || !category || order === null || published === null) return null;
    next.push({ id, question, answer, category, order, published });
  }
  next.sort((a, b) => a.order - b.order);
  return next;
}

function validateCareersJobs(input) {
  if (!Array.isArray(input)) return null;
  if (input.length > 2000) return null;
  const next = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'string' ? item.id : null;
    const title = typeof item.title === 'string' ? item.title : null;
    const department = typeof item.department === 'string' ? item.department : null;
    const location = typeof item.location === 'string' ? item.location : null;
    const type = typeof item.type === 'string' ? item.type : null;
    const description = typeof item.description === 'string' ? item.description : null;
    const requirements = Array.isArray(item.requirements) ? item.requirements : null;
    const responsibilities = Array.isArray(item.responsibilities) ? item.responsibilities : null;
    const salary = typeof item.salary === 'string' ? item.salary : null;
    const posted = typeof item.posted === 'string' ? item.posted : null;
    const active = typeof item.active === 'boolean' ? item.active : null;
    if (
      !id ||
      !title ||
      !department ||
      !location ||
      !type ||
      !description ||
      !requirements ||
      !responsibilities ||
      salary === null ||
      !posted ||
      active === null
    ) {
      return null;
    }
    const reqsOk = requirements.every((r) => typeof r === 'string');
    const respOk = responsibilities.every((r) => typeof r === 'string');
    if (!reqsOk || !respOk) return null;
    next.push({
      id,
      title,
      department,
      location,
      type,
      description,
      requirements,
      responsibilities,
      salary,
      posted,
      active,
    });
  }
  return next;
}

function validateCareersApplications(input) {
  if (!Array.isArray(input)) return null;
  if (input.length > 10000) return null;
  const allowedStatus = new Set(['new', 'reviewed', 'shortlisted', 'rejected']);
  const next = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'string' ? item.id : null;
    const applicantName = typeof item.applicantName === 'string' ? item.applicantName : null;
    const email = typeof item.email === 'string' ? item.email : null;
    const phone = typeof item.phone === 'string' ? item.phone : null;
    const location = typeof item.location === 'string' ? item.location : null;
    const jobTitle = typeof item.jobTitle === 'string' ? item.jobTitle : null;
    const jobId = typeof item.jobId === 'string' ? item.jobId : null;
    const appliedDate = typeof item.appliedDate === 'string' ? item.appliedDate : null;
    const resumeUrl = typeof item.resumeUrl === 'string' ? item.resumeUrl : null;
    const coverLetter = typeof item.coverLetter === 'string' ? item.coverLetter : null;
    const status = typeof item.status === 'string' ? item.status : null;
    const experience = typeof item.experience === 'string' ? item.experience : null;
    if (
      !id ||
      !applicantName ||
      !email ||
      !phone ||
      !location ||
      !jobTitle ||
      !jobId ||
      !appliedDate ||
      resumeUrl === null ||
      coverLetter === null ||
      !status ||
      !experience
    ) {
      return null;
    }
    if (!allowedStatus.has(status)) return null;
    next.push({
      id,
      applicantName,
      email,
      phone,
      location,
      jobTitle,
      jobId,
      appliedDate,
      resumeUrl,
      coverLetter,
      status,
      experience,
    });
  }
  return next;
}

function validateHomeManagement(input) {
  if (!input || typeof input !== 'object') return null;
  const heroData = input.heroData;
  const stats = input.stats;
  if (!heroData || typeof heroData !== 'object') return null;
  if (!Array.isArray(stats)) return null;
  if (stats.length < 1 || stats.length > 12) return null;

  const title = typeof heroData.title === 'string' ? heroData.title : null;
  const subtitle = typeof heroData.subtitle === 'string' ? heroData.subtitle : null;
  const ctaText = typeof heroData.ctaText === 'string' ? heroData.ctaText : null;
  const ctaLink = typeof heroData.ctaLink === 'string' ? heroData.ctaLink : null;
  const backgroundImage = typeof heroData.backgroundImage === 'string' ? heroData.backgroundImage : null;
  if (!title || !subtitle || !ctaText || !ctaLink || !backgroundImage) return null;

  const nextStats = [];
  for (const s of stats) {
    if (!s || typeof s !== 'object') return null;
    const label = typeof s.label === 'string' ? s.label : null;
    const value = typeof s.value === 'string' ? s.value : null;
    const suffix = typeof s.suffix === 'string' ? s.suffix : null;
    if (!label || !value || suffix === null) return null;
    nextStats.push({ label, value, suffix });
  }

  return { heroData: { title, subtitle, ctaText, ctaLink, backgroundImage }, stats: nextStats };
}

function signAccessToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    ACCESS_TOKEN_SECRET ?? 'dev_access_secret_change_me',
    { subject: user.id, expiresIn: ACCESS_TOKEN_TTL_SECONDS }
  );
}

function signRefreshToken(user, jti) {
  return jwt.sign(
    { type: 'refresh', jti },
    REFRESH_TOKEN_SECRET ?? 'dev_refresh_secret_change_me',
    { subject: user.id, expiresIn: REFRESH_TOKEN_TTL_SECONDS }
  );
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, cookieOptions(ACCESS_TOKEN_TTL_SECONDS * 1000));
  res.cookie('refresh_token', refreshToken, cookieOptions(REFRESH_TOKEN_TTL_SECONDS * 1000));
}

function clearAuthCookies(res) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
}

function clearCsrfCookie(res) {
  res.clearCookie('csrf_token', { path: '/' });
}

function getLockKey(req, email) {
  const ip = req.ip ?? 'unknown';
  return `${ip}:${email}`;
}

function getLockState(lockKey) {
  const state = failedLoginState.get(lockKey);
  if (!state) {
    const fresh = { failedAttempts: 0, lockUntil: null };
    failedLoginState.set(lockKey, fresh);
    return fresh;
  }
  return state;
}

function resetLockState(lockKey) {
  failedLoginState.delete(lockKey);
}

function recordFailedAttempt(lockKey) {
  const state = getLockState(lockKey);
  const failedAttempts = (state.failedAttempts ?? 0) + 1;
  const shouldLock = failedAttempts >= MAX_FAILED_ATTEMPTS;
  const lockUntil = shouldLock ? nowMs() + LOCKOUT_MS : null;
  const next = { failedAttempts, lockUntil };
  failedLoginState.set(lockKey, next);
  return next;
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

function requireOriginForUnsafeMethods(req, res, next) {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();
  const origin = req.headers.origin;
  if (typeof origin === 'string' && isAllowedOrigin(origin)) return next();
  return res.status(403).json({ ok: false, error: 'ORIGIN_NOT_ALLOWED' });
}

function requireCsrf(req, res, next) {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();

  const path = req.path;
  if (path === '/api/auth/login' || path === '/api/auth/refresh' || path === '/api/auth/logout' || path === '/api/auth/csrf') {
    return next();
  }

  const cookieToken = req.cookies?.csrf_token;
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || typeof headerToken !== 'string') {
    return res.status(403).json({ ok: false, error: 'CSRF_MISSING' });
  }
  if (cookieToken !== headerToken) {
    return res.status(403).json({ ok: false, error: 'CSRF_INVALID' });
  }
  return next();
}

function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET ?? 'dev_access_secret_change_me');
    if (!payload || typeof payload !== 'object') return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    req.auth = {
      userId: payload.sub ?? '1',
      email: payload.email ?? ADMIN_EMAIL,
      name: payload.name ?? 'Admin User',
      role: payload.role ?? 'admin',
    };
    return next();
  } catch {
    return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
  }
}

function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') return res.status(403).json({ ok: false, error: 'FORBIDDEN' });
  return next();
}

app.set('trust proxy', true);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error('CORS_NOT_ALLOWED'));
    },
    credentials: true,
  })
);
app.use(requireOriginForUnsafeMethods);
app.use(requireCsrf);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/auth/csrf', (_req, res) => {
  const token = crypto.randomBytes(32).toString('base64url');
  res.cookie('csrf_token', token, csrfCookieOptions(2 * 60 * 60 * 1000));
  res.json({ ok: true, csrfToken: token });
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    assertProductionConfig();
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');

    const lockKey = getLockKey(req, email);
    const lockState = getLockState(lockKey);
    if (lockState.lockUntil && nowMs() < lockState.lockUntil) {
      return res.status(423).json({ ok: false, error: 'LOCKED', lockUntil: lockState.lockUntil });
    }

    if (email !== ADMIN_EMAIL) {
      const next = recordFailedAttempt(lockKey);
      if (next.lockUntil) {
        return res.status(423).json({ ok: false, error: 'LOCKED', lockUntil: next.lockUntil });
      }
      return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS' });
    }

    const passwordOk =
      ADMIN_PASSWORD_HASH
        ? await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
        : ADMIN_PASSWORD
          ? password === ADMIN_PASSWORD
          : !isProd() && password === 'admin123';

    if (!passwordOk) {
      const next = recordFailedAttempt(lockKey);
      if (next.lockUntil) {
        return res.status(423).json({ ok: false, error: 'LOCKED', lockUntil: next.lockUntil });
      }
      return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS' });
    }

    resetLockState(lockKey);

    const user = {
      id: '1',
      email,
      name: 'Admin User',
      role: 'admin',
    };

    const accessToken = signAccessToken(user);
    const refreshJti = crypto.randomUUID();
    const refreshToken = signRefreshToken(user, refreshJti);
    const refreshTokenHash = sha256Base64Url(refreshToken);

    await withStoreWrite(async () => {
      const store = await readStore();
      store.refreshTokens[refreshJti] = {
        userId: user.id,
        tokenHash: refreshTokenHash,
        createdAt: nowMs(),
        expiresAt: nowMs() + REFRESH_TOKEN_TTL_SECONDS * 1000,
        revokedAt: null,
        replacedByJti: null,
      };
      await writeStore(store);
    });

    setAuthCookies(res, accessToken, refreshToken);
    const csrfToken = crypto.randomBytes(32).toString('base64url');
    res.cookie('csrf_token', csrfToken, csrfCookieOptions(2 * 60 * 60 * 1000));

    return res.json({ ok: true, user });
  } catch {
    return res.status(500).json({ ok: false, error: 'INTERNAL' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      const payload = jwt.verify(token, REFRESH_TOKEN_SECRET ?? 'dev_refresh_secret_change_me');
      if (payload && typeof payload === 'object' && payload.jti) {
        const jti = String(payload.jti);
        const tokenHash = sha256Base64Url(token);
        await withStoreWrite(async () => {
          const store = await readStore();
          const entry = store.refreshTokens[jti];
          if (entry && entry.tokenHash === tokenHash && !entry.revokedAt) {
            store.refreshTokens[jti] = { ...entry, revokedAt: nowMs() };
            await writeStore(store);
          }
        });
      }
    }
  } catch {
  }
  clearAuthCookies(res);
  clearCsrfCookie(res);
  res.json({ ok: true });
});

app.post('/api/auth/refresh', refreshLimiter, async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });

    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET ?? 'dev_refresh_secret_change_me');
    if (!payload || typeof payload !== 'object') return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    if (!payload.jti) return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    const jti = String(payload.jti);
    const userId = String(payload.sub ?? '1');
    const tokenHash = sha256Base64Url(token);

    const store = await readStore();
    const entry = store.refreshTokens[jti];
    if (!entry || entry.userId !== userId || entry.tokenHash !== tokenHash) {
      return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    }

    if (entry.revokedAt) {
      await revokeAllRefreshTokensForUser(userId);
      clearAuthCookies(res);
      clearCsrfCookie(res);
      return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    }
    if (typeof entry.expiresAt === 'number' && nowMs() >= entry.expiresAt) {
      await withStoreWrite(async () => {
        const nextStore = await readStore();
        const nextEntry = nextStore.refreshTokens[jti];
        if (nextEntry && !nextEntry.revokedAt) {
          nextStore.refreshTokens[jti] = { ...nextEntry, revokedAt: nowMs() };
          await writeStore(nextStore);
        }
      });
      clearAuthCookies(res);
      clearCsrfCookie(res);
      return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    }

    const user = {
      id: userId,
      email: ADMIN_EMAIL,
      name: 'Admin User',
      role: 'admin',
    };

    const accessToken = signAccessToken(user);
    const nextJti = crypto.randomUUID();
    const nextRefreshToken = signRefreshToken(user, nextJti);
    const nextRefreshHash = sha256Base64Url(nextRefreshToken);

    await withStoreWrite(async () => {
      const nextStore = await readStore();
      const current = nextStore.refreshTokens[jti];
      if (!current || current.revokedAt) return;
      nextStore.refreshTokens[jti] = { ...current, revokedAt: nowMs(), replacedByJti: nextJti };
      nextStore.refreshTokens[nextJti] = {
        userId,
        tokenHash: nextRefreshHash,
        createdAt: nowMs(),
        expiresAt: nowMs() + REFRESH_TOKEN_TTL_SECONDS * 1000,
        revokedAt: null,
        replacedByJti: null,
      };
      await writeStore(nextStore);
    });

    res.cookie('access_token', accessToken, cookieOptions(ACCESS_TOKEN_TTL_SECONDS * 1000));
    res.cookie('refresh_token', nextRefreshToken, cookieOptions(REFRESH_TOKEN_TTL_SECONDS * 1000));
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET ?? 'dev_access_secret_change_me');
    if (!payload || typeof payload !== 'object') return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });

    const user = {
      id: payload.sub ?? '1',
      email: payload.email ?? ADMIN_EMAIL,
      name: payload.name ?? 'Admin User',
      role: payload.role ?? 'admin',
    };
    return res.json({ ok: true, user });
  } catch {
    return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
  }
});

app.get('/api/content/tgcs', async (_req, res) => {
  const store = await readContentStore();
  const tgcs = store.tgcs ?? defaultTGCSData();
  res.json({ ok: true, tgcs });
});

app.get('/api/content/hero-slides', async (_req, res) => {
  const store = await readContentStore();
  const heroSlides = store.heroSlides ?? defaultHeroSlides();
  res.json({ ok: true, heroSlides });
});

app.get('/api/content/resources/insights', async (_req, res) => {
  const store = await readContentStore();
  const articles = (store.resourcesInsights ?? defaultResourcesInsights()).filter((a) => a.published);
  articles.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  res.json({ ok: true, articles });
});

app.get('/api/content/resources/case-studies', async (_req, res) => {
  const store = await readContentStore();
  const caseStudies = (store.resourcesCaseStudies ?? defaultResourcesCaseStudies()).filter(
    (cs) => cs.published
  );
  res.json({ ok: true, caseStudies });
});

app.get('/api/content/resources/faq', async (_req, res) => {
  const store = await readContentStore();
  const faqs = (store.resourcesFAQ ?? defaultResourcesFAQ()).filter((f) => f.published);
  faqs.sort((a, b) => a.order - b.order);
  res.json({ ok: true, faqs });
});

app.get('/api/content/careers/jobs', async (_req, res) => {
  const store = await readContentStore();
  const jobs = (store.careersJobs ?? defaultCareersJobs()).filter((j) => j.active);
  jobs.sort((a, b) => String(b.posted).localeCompare(String(a.posted)));
  res.json({ ok: true, jobs });
});

app.get('/api/admin/content/tgcs', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const tgcs = store.tgcs ?? defaultTGCSData();
  res.json({ ok: true, tgcs });
});

app.put('/api/admin/content/tgcs', requireAuth, requireAdmin, async (req, res) => {
  const tgcs = validateTGCSData(req.body?.tgcs);
  if (!tgcs) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, tgcs, tgcsUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/hero-slides', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const heroSlides = store.heroSlides ?? defaultHeroSlides();
  res.json({ ok: true, heroSlides });
});

app.put('/api/admin/content/hero-slides', requireAuth, requireAdmin, async (req, res) => {
  const heroSlides = validateHeroSlides(req.body?.heroSlides);
  if (!heroSlides) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, heroSlides, heroSlidesUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/home-management', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const homeManagement = store.homeManagement ?? null;
  res.json({ ok: true, homeManagement });
});

app.put('/api/admin/content/home-management', requireAuth, requireAdmin, async (req, res) => {
  const homeManagement = validateHomeManagement(req.body?.homeManagement);
  if (!homeManagement) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, homeManagement, homeManagementUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/resources/insights', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const articles = store.resourcesInsights ?? defaultResourcesInsights();
  res.json({ ok: true, articles });
});

app.put('/api/admin/content/resources/insights', requireAuth, requireAdmin, async (req, res) => {
  const articles = validateResourcesInsights(req.body?.articles);
  if (!articles) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, resourcesInsights: articles, resourcesInsightsUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/resources/case-studies', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const caseStudies = store.resourcesCaseStudies ?? defaultResourcesCaseStudies();
  res.json({ ok: true, caseStudies });
});

app.put('/api/admin/content/resources/case-studies', requireAuth, requireAdmin, async (req, res) => {
  const caseStudies = validateResourcesCaseStudies(req.body?.caseStudies);
  if (!caseStudies) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({
      ...store,
      resourcesCaseStudies: caseStudies,
      resourcesCaseStudiesUpdatedAt: nowMs(),
    });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/resources/faq', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const faqs = store.resourcesFAQ ?? defaultResourcesFAQ();
  res.json({ ok: true, faqs });
});

app.put('/api/admin/content/resources/faq', requireAuth, requireAdmin, async (req, res) => {
  const faqs = validateResourcesFAQ(req.body?.faqs);
  if (!faqs) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, resourcesFAQ: faqs, resourcesFAQUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/careers/jobs', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const jobs = store.careersJobs ?? defaultCareersJobs();
  res.json({ ok: true, jobs });
});

app.put('/api/admin/content/careers/jobs', requireAuth, requireAdmin, async (req, res) => {
  const jobs = validateCareersJobs(req.body?.jobs);
  if (!jobs) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, careersJobs: jobs, careersJobsUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/careers/applications', requireAuth, requireAdmin, async (_req, res) => {
  const store = await readContentStore();
  const applications = store.careersApplications ?? defaultCareersApplications();
  res.json({ ok: true, applications });
});

app.put('/api/admin/content/careers/applications', requireAuth, requireAdmin, async (req, res) => {
  const applications = validateCareersApplications(req.body?.applications);
  if (!applications) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({
      ...store,
      careersApplications: applications,
      careersApplicationsUpdatedAt: nowMs(),
    });
  });

  res.json({ ok: true });
});

app.get('/api/admin/ping', requireAuth, requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  assertProductionConfig();
  console.log(`API listening on http://localhost:${PORT}`);
});
