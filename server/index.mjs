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
import multer from 'multer';
import {
  initDatabase,
  getContentValue,
  setContentValue,
  getPageContent,
  setPageContent,
  getContactMessages,
  insertContactMessage,
  deleteContactMessage,
  updateContactMessageStatus,
  getRefreshToken,
  insertRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  getSetting,
  setSetting,
  query,
} from './db.mjs';

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

const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL ?? ADMIN_EMAIL).trim().toLowerCase();
const SUPER_ADMIN_PASSWORD_HASH = process.env.SUPER_ADMIN_PASSWORD_HASH ?? ADMIN_PASSWORD_HASH;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD ?? ADMIN_PASSWORD;

const CONTENT_EMAIL = (process.env.CONTENT_EMAIL ?? 'content@supercorridor.com').trim().toLowerCase();
const CONTENT_PASSWORD_HASH = process.env.CONTENT_PASSWORD_HASH ?? null;
const CONTENT_PASSWORD = process.env.CONTENT_PASSWORD ?? null;

const HR_EMAIL = (process.env.HR_EMAIL ?? 'hr@supercorridor.com').trim().toLowerCase();
const HR_PASSWORD_HASH = process.env.HR_PASSWORD_HASH ?? null;
const HR_PASSWORD = process.env.HR_PASSWORD ?? null;

const SALES_EMAIL = (process.env.SALES_EMAIL ?? 'sales@supercorridor.com').trim().toLowerCase();
const SALES_PASSWORD_HASH = process.env.SALES_PASSWORD_HASH ?? null;
const SALES_PASSWORD = process.env.SALES_PASSWORD ?? null;

const SOLUSI_ENTERPRISE_JWT_SECRET = process.env.SOLUSI_ENTERPRISE_JWT_SECRET ?? 'solusi-enterprise-shared-secret-2026';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

const failedLoginState = new Map();

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(os.tmpdir(), 'supercorridor-uploads');
const RESUME_UPLOAD_DIR = path.join(UPLOADS_DIR, 'resumes');
const resumeUpload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      fs.mkdir(RESUME_UPLOAD_DIR, { recursive: true })
        .then(() => cb(null, RESUME_UPLOAD_DIR))
        .catch((err) => cb(err, RESUME_UPLOAD_DIR));
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname ?? '').toLowerCase();
      const allowedExt = new Set(['.pdf', '.doc', '.docx']);
      const safeExt = allowedExt.has(ext) ? ext : '';
      const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname ?? '').toLowerCase();
    const allowedExt = new Set(['.pdf', '.doc', '.docx']);
    const allowedMime = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    cb(null, allowedExt.has(ext) || allowedMime.has(file.mimetype));
  },
});

const IMAGE_UPLOAD_DIR = path.join(UPLOADS_DIR, 'images');
const imageUpload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      fs.mkdir(IMAGE_UPLOAD_DIR, { recursive: true })
        .then(() => cb(null, IMAGE_UPLOAD_DIR))
        .catch((err) => cb(err, IMAGE_UPLOAD_DIR));
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname ?? '').toLowerCase();
      const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
      const safeExt = allowedExt.has(ext) ? ext : '.jpg';
      const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname ?? '').toLowerCase();
    const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
    const allowedMime = new Set([
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ]);
    cb(null, allowedExt.has(ext) || allowedMime.has(file.mimetype));
  },
});

function resumeUploadMiddleware(req, res, next) {
  resumeUpload.single('resume')(req, res, (err) => {
    if (!err) return next();
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ ok: false, error: 'FILE_TOO_LARGE' });
    }
    return res.status(400).json({ ok: false, error: 'UPLOAD_FAILED' });
  });
}

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
  if (!SUPER_ADMIN_PASSWORD_HASH) {
    throw new Error('ADMIN_PASSWORD_HASH (or SUPER_ADMIN_PASSWORD_HASH) must be set in production');
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

// --- PostgreSQL-backed store functions ---
async function readContentStore() {
  // Returns a combined object of all content_store rows for backward compatibility
  const result = await query('SELECT key, value FROM content_store');
  const store = {};
  for (const row of result.rows) {
    store[row.key] = row.value;
  }
  return store;
}

async function writeContentStore(next) {
  // Write each key individually
  for (const [key, value] of Object.entries(next)) {
    if (key.endsWith('UpdatedAt') || key.endsWith('_updatedAt')) continue;
    await setContentValue(key, value);
  }
}

async function withContentWrite(fn) {
  // No queue needed with PostgreSQL - just execute
  await fn();
}

async function withStoreWrite(fn) {
  await fn();
}

async function readStore() {
  // For backward compatibility - not used with PostgreSQL directly
  return { refreshTokens: {} };
}

async function writeStore(_next) {
  // No-op - individual token operations handle this
}

async function revokeAllRefreshTokensForUser(userId) {
  await revokeAllUserTokens(userId, nowMs());
}

function defaultTGCSData() {
  return {
    hero: {
      title: 'SuperCorridor TGCS',
      subtitle: 'Trans Global Cable System',
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

function defaultCustomersData() {
  return {
    customers: [
      { id: '1', name: 'PT Bank Central Asia', logo: 'https://via.placeholder.com/150x80?text=BCA', industry: 'Banking' },
      { id: '2', name: 'PT Telkom Indonesia', logo: 'https://via.placeholder.com/150x80?text=Telkom', industry: 'Telecommunications' },
      { id: '3', name: 'PT Astra International', logo: 'https://via.placeholder.com/150x80?text=Astra', industry: 'Automotive' },
    ],
    testimonials: [
      {
        id: '1',
        customerName: 'John Smith',
        position: 'CTO',
        company: 'Tech Corp Indonesia',
        content: 'SuperCorridor has been instrumental in our digital transformation. Their reliable network and excellent support have exceeded our expectations.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        customerName: 'Sarah Johnson',
        position: 'IT Director',
        company: 'Global Finance Ltd',
        content: 'The 99.99% uptime guarantee is not just a promise - they deliver. Our operations have never been smoother.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
    ],
  };
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
  const allowedGender = new Set(['male', 'female']);
  const allowedMarital = new Set(['single', 'married', 'divorced', 'widowed']);
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
    const nik = typeof item.nik === 'string' ? item.nik : '';
    const birthPlace = typeof item.birthPlace === 'string' ? item.birthPlace : '';
    const birthDate = typeof item.birthDate === 'string' ? item.birthDate : '';
    const gender = typeof item.gender === 'string' ? item.gender : '';
    const maritalStatus = typeof item.maritalStatus === 'string' ? item.maritalStatus : '';
    const address = typeof item.address === 'string' ? item.address : '';
    const city = typeof item.city === 'string' ? item.city : '';
    const postalCode = typeof item.postalCode === 'string' ? item.postalCode : '';
    const educationLevel = typeof item.educationLevel === 'string' ? item.educationLevel : '';
    const institution = typeof item.institution === 'string' ? item.institution : '';
    const major = typeof item.major === 'string' ? item.major : '';
    const gpa = typeof item.gpa === 'string' ? item.gpa : '';
    const expectedSalary = typeof item.expectedSalary === 'string' ? item.expectedSalary : '';
    const availableStartDate = typeof item.availableStartDate === 'string' ? item.availableStartDate : '';
    const emergencyName = typeof item.emergencyName === 'string' ? item.emergencyName : '';
    const emergencyPhone = typeof item.emergencyPhone === 'string' ? item.emergencyPhone : '';
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
    if (gender && !allowedGender.has(gender)) return null;
    if (maritalStatus && !allowedMarital.has(maritalStatus)) return null;
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
      nik,
      birthPlace,
      birthDate,
      gender,
      maritalStatus,
      address,
      city,
      postalCode,
      educationLevel,
      institution,
      major,
      gpa,
      expectedSalary,
      availableStartDate,
      emergencyName,
      emergencyPhone,
    });
  }
  return next;
}

function validateCareersApplicationCreate(input) {
  if (!input || typeof input !== 'object') return null;
  const applicantName = typeof input.applicantName === 'string' ? input.applicantName.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const jobId = typeof input.jobId === 'string' ? input.jobId.trim() : '';
  const experience = typeof input.experience === 'string' ? input.experience.trim() : '';
  const resumeUrl = typeof input.resumeUrl === 'string' ? input.resumeUrl.trim() : '';
  const coverLetter = typeof input.coverLetter === 'string' ? input.coverLetter.trim() : '';
  const nik = typeof input.nik === 'string' ? input.nik.trim() : '';
  const birthPlace = typeof input.birthPlace === 'string' ? input.birthPlace.trim() : '';
  const birthDate = typeof input.birthDate === 'string' ? input.birthDate.trim() : '';
  const gender = typeof input.gender === 'string' ? input.gender.trim() : '';
  const maritalStatus = typeof input.maritalStatus === 'string' ? input.maritalStatus.trim() : '';
  const address = typeof input.address === 'string' ? input.address.trim() : '';
  const city = typeof input.city === 'string' ? input.city.trim() : '';
  const postalCode = typeof input.postalCode === 'string' ? input.postalCode.trim() : '';
  const educationLevel = typeof input.educationLevel === 'string' ? input.educationLevel.trim() : '';
  const institution = typeof input.institution === 'string' ? input.institution.trim() : '';
  const major = typeof input.major === 'string' ? input.major.trim() : '';
  const gpa = typeof input.gpa === 'string' ? input.gpa.trim() : '';
  const expectedSalary = typeof input.expectedSalary === 'string' ? input.expectedSalary.trim() : '';
  const availableStartDate = typeof input.availableStartDate === 'string' ? input.availableStartDate.trim() : '';
  const emergencyName = typeof input.emergencyName === 'string' ? input.emergencyName.trim() : '';
  const emergencyPhone = typeof input.emergencyPhone === 'string' ? input.emergencyPhone.trim() : '';

  if (
    !applicantName ||
    !email ||
    !phone ||
    !jobId ||
    !experience ||
    !nik ||
    !birthDate ||
    !gender ||
    !address ||
    !city ||
    !educationLevel ||
    !institution ||
    !major ||
    !expectedSalary ||
    !emergencyName ||
    !emergencyPhone
  ) {
    return null;
  }
  if (applicantName.length > 200) return null;
  if (email.length > 320) return null;
  if (phone.length > 50) return null;
  if (jobId.length > 100) return null;
  if (experience.length > 100) return null;
  if (resumeUrl.length > 2000) return null;
  if (coverLetter.length > 20000) return null;
  if (nik.length > 40) return null;
  if (!/^[0-9]{8,40}$/.test(nik)) return null;
  if (birthPlace.length > 200) return null;
  if (birthDate.length > 20) return null;
  if (gender !== 'male' && gender !== 'female') return null;
  if (maritalStatus && maritalStatus.length > 20) return null;
  if (maritalStatus && !['single', 'married', 'divorced', 'widowed'].includes(maritalStatus)) return null;
  if (address.length > 500) return null;
  if (city.length > 200) return null;
  if (postalCode.length > 20) return null;
  if (educationLevel.length > 100) return null;
  if (institution.length > 200) return null;
  if (major.length > 200) return null;
  if (gpa.length > 20) return null;
  if (expectedSalary.length > 50) return null;
  if (availableStartDate.length > 20) return null;
  if (emergencyName.length > 200) return null;
  if (emergencyPhone.length > 50) return null;

  if (!email.includes('@')) return null;

  const location = city;
  return {
    applicantName,
    email,
    phone,
    location,
    jobId,
    experience,
    resumeUrl,
    coverLetter,
    nik,
    birthPlace,
    birthDate,
    gender,
    maritalStatus,
    address,
    city,
    postalCode,
    educationLevel,
    institution,
    major,
    gpa,
    expectedSalary,
    availableStartDate,
    emergencyName,
    emergencyPhone,
  };
}

function validateHomeManagement(input) {
  if (!input || typeof input !== 'object') return null;
  const heroData = input.heroData;
  const stats = input.stats;
  if (!heroData || typeof heroData !== 'object') return null;
  if (!Array.isArray(stats)) return null;
  if (stats.length < 1 || stats.length > 12) return null;

  const title = typeof heroData.title === 'string' ? heroData.title : '';
  const subtitle = typeof heroData.subtitle === 'string' ? heroData.subtitle : '';
  const ctaText = typeof heroData.ctaText === 'string' ? heroData.ctaText : '';
  const ctaLink = typeof heroData.ctaLink === 'string' ? heroData.ctaLink : '';
  const backgroundImage = typeof heroData.backgroundImage === 'string' ? heroData.backgroundImage : '';

  const nextStats = [];
  for (const s of stats) {
    if (!s || typeof s !== 'object') return null;
    const label = typeof s.label === 'string' ? s.label : null;
    const value = typeof s.value === 'string' ? s.value : null;
    const suffix = typeof s.suffix === 'string' ? s.suffix : null;
    if (!label || !value || suffix === null) return null;
    nextStats.push({ label, value, suffix });
  }

  // Features (optional)
  let nextFeatures = null;
  if (Array.isArray(input.features) && input.features.length > 0) {
    nextFeatures = [];
    for (const f of input.features) {
      if (!f || typeof f !== 'object') continue;
      const fTitle = typeof f.title === 'string' ? f.title : '';
      const fDesc = typeof f.description === 'string' ? f.description : '';
      if (fTitle) nextFeatures.push({ title: fTitle, description: fDesc });
    }
  }

  const result = { heroData: { title, subtitle, ctaText, ctaLink, backgroundImage }, stats: nextStats };
  if (nextFeatures && nextFeatures.length > 0) result.features = nextFeatures;
  return result;
}

function signAccessToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    ACCESS_TOKEN_SECRET ?? 'dev_access_secret_change_me',
    { subject: user.id, expiresIn: ACCESS_TOKEN_TTL_SECONDS }
  );
}

function normalizeRole(rawRole) {
  const role = String(rawRole ?? '').trim().toLowerCase();
  if (role === 'admin') return 'super_admin';
  if (role === 'super_admin' || role === 'content' || role === 'hr' || role === 'sales') return role;
  return null;
}

function signRefreshToken(user, jti) {
  return jwt.sign(
    { type: 'refresh', jti, email: user.email, name: user.name, role: user.role },
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
    const role = normalizeRole(payload.role);
    if (!role) return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    req.auth = {
      userId: payload.sub ?? '1',
      email: payload.email ?? SUPER_ADMIN_EMAIL,
      name: payload.name ?? 'Admin User',
      role,
    };
    return next();
  } catch {
    return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
  }
}

function requireAnyRole(allowedRoles) {
  return function requireRoleMiddleware(req, res, next) {
    if (!req.auth?.role || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ ok: false, error: 'FORBIDDEN' });
    }
    return next();
  };
}

const requireAdminAny = requireAnyRole(['super_admin', 'content', 'hr', 'sales']);
const requireContentAdmin = requireAnyRole(['super_admin', 'content']);
const requireHrAdmin = requireAnyRole(['super_admin', 'hr']);
const requireSalesAdmin = requireAnyRole(['super_admin', 'sales']);

app.set('trust proxy', true);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    setHeaders(res) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);
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

    const accounts = [
      {
        id: '1',
        email: SUPER_ADMIN_EMAIL,
        aliases: [SUPER_ADMIN_EMAIL, 'admin@supercorridor.com', 'admin@supercorridor.co.id'],
        name: 'Super Admin',
        role: 'super_admin',
        passwordHash: SUPER_ADMIN_PASSWORD_HASH,
        passwordPlain: SUPER_ADMIN_PASSWORD,
        devFallbackPassword: 'admin123',
      },
      {
        id: '2',
        email: CONTENT_EMAIL,
        aliases: [CONTENT_EMAIL, 'content@supercorridor.com', 'content@supercorridor.co.id'],
        name: 'Content Admin',
        role: 'content',
        passwordHash: CONTENT_PASSWORD_HASH,
        passwordPlain: CONTENT_PASSWORD,
        devFallbackPassword: 'content123',
      },
      {
        id: '3',
        email: HR_EMAIL,
        aliases: [HR_EMAIL, 'hr@supercorridor.com', 'hr@supercorridor.co.id'],
        name: 'HR Admin',
        role: 'hr',
        passwordHash: HR_PASSWORD_HASH,
        passwordPlain: HR_PASSWORD,
        devFallbackPassword: 'hr123',
      },
      {
        id: '4',
        email: SALES_EMAIL,
        aliases: [SALES_EMAIL, 'sales@supercorridor.com', 'sales@supercorridor.co.id'],
        name: 'Sales User',
        role: 'sales',
        passwordHash: SALES_PASSWORD_HASH,
        passwordPlain: SALES_PASSWORD,
        devFallbackPassword: 'sales123',
      },
    ];

    const account = accounts.find((a) => a.aliases.includes(email)) ?? null;

    if (!account) {
      const next = recordFailedAttempt(lockKey);
      if (next.lockUntil) {
        return res.status(423).json({ ok: false, error: 'LOCKED', lockUntil: next.lockUntil });
      }
      return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS' });
    }

    const passwordOk =
      account.passwordHash
        ? await bcrypt.compare(password, account.passwordHash)
        : account.passwordPlain
          ? password === account.passwordPlain
          : password === account.devFallbackPassword;

    if (!passwordOk) {
      const next = recordFailedAttempt(lockKey);
      if (next.lockUntil) {
        return res.status(423).json({ ok: false, error: 'LOCKED', lockUntil: next.lockUntil });
      }
      return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS' });
    }

    resetLockState(lockKey);

    const user = { id: account.id, email: account.email, name: account.name, role: account.role };

    const accessToken = signAccessToken(user);
    const refreshJti = crypto.randomUUID();
    const refreshToken = signRefreshToken(user, refreshJti);
    const refreshTokenHash = sha256Base64Url(refreshToken);

    await insertRefreshToken(refreshJti, {
      userId: user.id,
      tokenHash: refreshTokenHash,
      createdAt: nowMs(),
      expiresAt: nowMs() + REFRESH_TOKEN_TTL_SECONDS * 1000,
      revokedAt: null,
      replacedByJti: null,
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
        const entry = await getRefreshToken(jti);
        if (entry && entry.tokenHash === tokenHash && !entry.revokedAt) {
          await revokeRefreshToken(jti, nowMs(), null);
        }
      }
    }
  } catch (err) {
    void err;
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

    const entry = await getRefreshToken(jti);
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
      await revokeRefreshToken(jti, nowMs(), null);
      clearAuthCookies(res);
      clearCsrfCookie(res);
      return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
    }

    const role = normalizeRole(payload.role) ?? 'super_admin';
    const user = {
      id: userId,
      email: payload.email ?? SUPER_ADMIN_EMAIL,
      name: payload.name ?? 'Admin User',
      role,
    };

    const accessToken = signAccessToken(user);
    const nextJti = crypto.randomUUID();
    const nextRefreshToken = signRefreshToken(user, nextJti);
    const nextRefreshHash = sha256Base64Url(nextRefreshToken);

    await revokeRefreshToken(jti, nowMs(), nextJti);
    await insertRefreshToken(nextJti, {
      userId,
      tokenHash: nextRefreshHash,
      createdAt: nowMs(),
      expiresAt: nowMs() + REFRESH_TOKEN_TTL_SECONDS * 1000,
      revokedAt: null,
      replacedByJti: null,
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
    const role = normalizeRole(payload.role);
    if (!role) return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });

    const user = {
      id: payload.sub ?? '1',
      email: payload.email ?? SUPER_ADMIN_EMAIL,
      name: payload.name ?? 'Admin User',
      role,
    };
    return res.json({ ok: true, user });
  } catch {
    return res.status(401).json({ ok: false, error: 'UNAUTHENTICATED' });
  }
});

// SSO token endpoint for Solusi Enterprise
// Issues a JWT that solusi-enterprise backend can validate
app.post('/api/auth/solusi-token', requireAuth, requireSalesAdmin, (req, res) => {
  try {
    const user = req.auth;
    const payload = {
      sub: user.userId,
      email: user.email,
      role: 'sales',
      tenantId: 'supercorridor',
      name: user.name,
      iss: 'supercorridor',
    };
    const accessToken = jwt.sign(payload, SOLUSI_ENTERPRISE_JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      SOLUSI_ENTERPRISE_JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({
      ok: true,
      accessToken,
      refreshToken,
      user: { id: user.userId, name: user.name, email: user.email, role: 'sales' },
    });
  } catch {
    return res.status(500).json({ ok: false, error: 'INTERNAL' });
  }
});

app.get('/api/content/tgcs', async (_req, res) => {
  const tgcs = await getContentValue('tgcs') ?? defaultTGCSData();
  res.json({ ok: true, tgcs });
});

app.get('/api/content/hero-slides', async (_req, res) => {
  const heroSlides = await getContentValue('heroSlides') ?? defaultHeroSlides();
  res.json({ ok: true, heroSlides });
});

app.get('/api/content/home-management', async (_req, res) => {
  const homeManagement = await getContentValue('homeManagement') ?? null;
  res.json({ ok: true, homeManagement });
});

app.get('/api/content/resources/insights', async (_req, res) => {
  const articles = ((await getContentValue('resourcesInsights')) ?? defaultResourcesInsights()).filter((a) => a.published);
  articles.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  res.json({ ok: true, articles });
});

app.get('/api/content/resources/case-studies', async (_req, res) => {
  const caseStudies = ((await getContentValue('resourcesCaseStudies')) ?? defaultResourcesCaseStudies()).filter(
    (cs) => cs.published
  );
  res.json({ ok: true, caseStudies });
});

app.get('/api/content/resources/faq', async (_req, res) => {
  const faqs = ((await getContentValue('resourcesFAQ')) ?? defaultResourcesFAQ()).filter((f) => f.published);
  faqs.sort((a, b) => a.order - b.order);
  res.json({ ok: true, faqs });
});

app.get('/api/content/careers/jobs', async (_req, res) => {
  const jobs = ((await getContentValue('careersJobs')) ?? defaultCareersJobs()).filter((j) => j.active);
  jobs.sort((a, b) => String(b.posted).localeCompare(String(a.posted)));
  res.json({ ok: true, jobs });
});

app.get('/api/content/network-coverage', async (_req, res) => {
  const networkCoverage = (await getContentValue('networkCoverage')) ?? defaultNetworkCoverage();
  res.json({ ok: true, networkCoverage });
});

app.get('/api/content/customers', async (_req, res) => {
  const customers = (await getContentValue('customers')) ?? defaultCustomersData();
  res.json({ ok: true, customers });
});

app.post('/api/careers/apply', resumeUploadMiddleware, async (req, res) => {
  const input = validateCareersApplicationCreate(req.body);
  if (!input) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  const store = await readContentStore();
  const jobs = store.careersJobs ?? defaultCareersJobs();
  const job = jobs.find((j) => j && typeof j === 'object' && j.id === input.jobId);
  if (!job || !job.active) return res.status(404).json({ ok: false, error: 'JOB_NOT_FOUND' });

  const resumeUrl = req.file?.filename
    ? `/uploads/resumes/${req.file.filename}`
    : input.resumeUrl;
  if (!resumeUrl) return res.status(400).json({ ok: false, error: 'RESUME_REQUIRED' });

  const appliedDate = new Date().toISOString().slice(0, 10);
  const application = {
    id: crypto.randomBytes(12).toString('base64url'),
    applicantName: input.applicantName,
    email: input.email,
    phone: input.phone,
    location: input.location,
    jobTitle: String(job.title ?? ''),
    jobId: String(job.id ?? input.jobId),
    appliedDate,
    resumeUrl,
    coverLetter: input.coverLetter,
    status: 'new',
    experience: input.experience,
    nik: input.nik,
    birthPlace: input.birthPlace,
    birthDate: input.birthDate,
    gender: input.gender,
    maritalStatus: input.maritalStatus,
    address: input.address,
    city: input.city,
    postalCode: input.postalCode,
    educationLevel: input.educationLevel,
    institution: input.institution,
    major: input.major,
    gpa: input.gpa,
    expectedSalary: input.expectedSalary,
    availableStartDate: input.availableStartDate,
    emergencyName: input.emergencyName,
    emergencyPhone: input.emergencyPhone,
  };

  await withContentWrite(async () => {
    const current = await readContentStore();
    const existing = current.careersApplications ?? defaultCareersApplications();
    const next = [application, ...existing].slice(0, 10000);
    await writeContentStore({
      ...current,
      careersApplications: next,
      careersApplicationsUpdatedAt: nowMs(),
    });
  });

  res.json({ ok: true, id: application.id });
});

app.get('/api/admin/content/tgcs', requireAuth, requireContentAdmin, async (_req, res) => {
  const tgcs = (await getContentValue('tgcs')) ?? defaultTGCSData();
  res.json({ ok: true, tgcs });
});

app.put('/api/admin/content/tgcs', requireAuth, requireContentAdmin, async (req, res) => {
  const tgcs = validateTGCSData(req.body?.tgcs);
  if (!tgcs) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  await setContentValue('tgcs', tgcs);
  res.json({ ok: true });
});

app.get('/api/admin/content/hero-slides', requireAuth, requireContentAdmin, async (_req, res) => {
  const heroSlides = (await getContentValue('heroSlides')) ?? defaultHeroSlides();
  res.json({ ok: true, heroSlides });
});

app.put('/api/admin/content/hero-slides', requireAuth, requireContentAdmin, async (req, res) => {
  const heroSlides = validateHeroSlides(req.body?.heroSlides);
  if (!heroSlides) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  await setContentValue('heroSlides', heroSlides);
  res.json({ ok: true });
});

app.get('/api/admin/content/home-management', requireAuth, requireContentAdmin, async (_req, res) => {
  const homeManagement = (await getContentValue('homeManagement')) ?? null;
  res.json({ ok: true, homeManagement });
});

app.put('/api/admin/content/home-management', requireAuth, requireContentAdmin, async (req, res) => {
  const homeManagement = validateHomeManagement(req.body?.homeManagement);
  if (!homeManagement) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  await setContentValue('homeManagement', homeManagement);
  res.json({ ok: true });
});

app.get('/api/admin/content/resources/insights', requireAuth, requireContentAdmin, async (_req, res) => {
  const store = await readContentStore();
  const articles = store.resourcesInsights ?? defaultResourcesInsights();
  res.json({ ok: true, articles });
});

app.put('/api/admin/content/resources/insights', requireAuth, requireContentAdmin, async (req, res) => {
  const articles = validateResourcesInsights(req.body?.articles);
  if (!articles) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, resourcesInsights: articles, resourcesInsightsUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/resources/case-studies', requireAuth, requireContentAdmin, async (_req, res) => {
  const store = await readContentStore();
  const caseStudies = store.resourcesCaseStudies ?? defaultResourcesCaseStudies();
  res.json({ ok: true, caseStudies });
});

app.put('/api/admin/content/resources/case-studies', requireAuth, requireContentAdmin, async (req, res) => {
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

app.get('/api/admin/content/resources/faq', requireAuth, requireContentAdmin, async (_req, res) => {
  const store = await readContentStore();
  const faqs = store.resourcesFAQ ?? defaultResourcesFAQ();
  res.json({ ok: true, faqs });
});

app.put('/api/admin/content/resources/faq', requireAuth, requireContentAdmin, async (req, res) => {
  const faqs = validateResourcesFAQ(req.body?.faqs);
  if (!faqs) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, resourcesFAQ: faqs, resourcesFAQUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/careers/jobs', requireAuth, requireHrAdmin, async (_req, res) => {
  const store = await readContentStore();
  const jobs = store.careersJobs ?? defaultCareersJobs();
  res.json({ ok: true, jobs });
});

app.put('/api/admin/content/careers/jobs', requireAuth, requireHrAdmin, async (req, res) => {
  const jobs = validateCareersJobs(req.body?.jobs);
  if (!jobs) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, careersJobs: jobs, careersJobsUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

app.get('/api/admin/content/careers/applications', requireAuth, requireHrAdmin, async (_req, res) => {
  const store = await readContentStore();
  const applications = store.careersApplications ?? defaultCareersApplications();
  res.json({ ok: true, applications });
});

app.put('/api/admin/content/careers/applications', requireAuth, requireHrAdmin, async (req, res) => {
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

// --- Send Status Email to Applicant ---
app.post('/api/admin/careers/send-status-email', requireAuth, requireHrAdmin, async (req, res) => {
  const { applicantName, email, jobTitle, status } = req.body ?? {};
  if (!applicantName || !email || !jobTitle || !status) {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }

  const statusMessages = {
    new: 'We have received your application and it is currently under review.',
    reviewed: 'Your application has been reviewed by our hiring team.',
    shortlisted: 'Congratulations! You have been shortlisted for the next stage of our hiring process. We will contact you shortly to schedule an interview.',
    rejected: 'Thank you for your interest. After careful consideration, we have decided to move forward with other candidates. We encourage you to apply for future openings.',
  };

  const message = statusMessages[status] ?? 'Your application status has been updated.';

  // Store the email log (in production, integrate with email service like SendGrid/SES)
  const emailLog = {
    id: crypto.randomBytes(12).toString('base64url'),
    to: email,
    applicantName,
    jobTitle,
    status,
    message,
    sentAt: new Date().toISOString(),
  };

  // Save email log
  const existingLogs = (await getContentValue('emailLogs')) ?? [];
  await setContentValue('emailLogs', [emailLog, ...existingLogs].slice(0, 1000));

  // In production: send actual email here via nodemailer/SendGrid/SES
  // For now, just log it
  console.log(`[EMAIL] To: ${email} | Subject: Application Status Update - ${jobTitle} | Status: ${status}`);

  res.json({ ok: true, emailLog });
});

// --- Admin Customers ---
app.get('/api/admin/content/customers', requireAuth, requireContentAdmin, async (_req, res) => {
  const store = await readContentStore();
  const customers = store.customers ?? defaultCustomersData();
  res.json({ ok: true, customers });
});

app.put('/api/admin/content/customers', requireAuth, requireContentAdmin, async (req, res) => {
  const input = req.body?.customers;
  if (!input || typeof input !== 'object') return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  // Validate customers array
  const customersList = input.customers;
  const testimonialsList = input.testimonials;
  if (!Array.isArray(customersList) || !Array.isArray(testimonialsList)) {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }
  if (customersList.length > 200 || testimonialsList.length > 200) {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }

  for (const c of customersList) {
    if (!c || typeof c !== 'object') return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    if (typeof c.id !== 'string' || typeof c.name !== 'string' || typeof c.logo !== 'string' || typeof c.industry !== 'string') {
      return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    }
  }

  for (const t of testimonialsList) {
    if (!t || typeof t !== 'object') return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    if (typeof t.id !== 'string' || typeof t.customerName !== 'string' || typeof t.position !== 'string' ||
        typeof t.company !== 'string' || typeof t.content !== 'string' || typeof t.rating !== 'number' ||
        typeof t.avatar !== 'string') {
      return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    }
  }

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({
      ...store,
      customers: { customers: customersList, testimonials: testimonialsList },
      customersUpdatedAt: nowMs(),
    });
  });

  res.json({ ok: true });
});

app.get('/api/admin/ping', requireAuth, requireAdminAny, (_req, res) => {
  res.json({ ok: true });
});

// --- User Management (Super Admin only) ---
const requireSuperAdmin = requireAnyRole(['super_admin']);

app.get('/api/admin/users', requireAuth, requireSuperAdmin, async (_req, res) => {
  const users = (await getContentValue('adminUsers')) ?? [
    { id: '1', email: SUPER_ADMIN_EMAIL, name: 'Super Admin', role: 'super_admin', permissions: ['dashboard','home','tgcs','solutions','technology','about','network','resources','customers','contact','careers','settings','users'], active: true, createdAt: '2024-01-01' },
    { id: '2', email: CONTENT_EMAIL, name: 'Content Admin', role: 'content', permissions: ['dashboard','home','tgcs','solutions','technology','about','network','resources','customers','contact','settings'], active: true, createdAt: '2024-01-01' },
    { id: '3', email: HR_EMAIL, name: 'HR Admin', role: 'hr', permissions: ['dashboard','careers','settings'], active: true, createdAt: '2024-01-01' },
  ];
  // Strip passwordHash from response
  const safeUsers = users.map(({ passwordHash, ...u }) => u);
  res.json({ ok: true, users: safeUsers });
});

app.post('/api/admin/users/create', requireAuth, requireSuperAdmin, async (req, res) => {
  const { email, name, role, password, active, permissions } = req.body ?? {};
  if (!email || !name || !role || !password) {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }
  if (!['super_admin', 'content', 'hr', 'sales'].includes(role)) {
    return res.status(400).json({ ok: false, error: 'INVALID_ROLE' });
  }
  if (password.length < 6) {
    return res.status(400).json({ ok: false, error: 'PASSWORD_TOO_SHORT' });
  }

  const users = (await getContentValue('adminUsers')) ?? [
    { id: '1', email: SUPER_ADMIN_EMAIL, name: 'Super Admin', role: 'super_admin', permissions: ['dashboard','home','tgcs','solutions','technology','about','network','resources','customers','contact','careers','settings','users'], active: true, createdAt: '2024-01-01' },
    { id: '2', email: CONTENT_EMAIL, name: 'Content Admin', role: 'content', permissions: ['dashboard','home','tgcs','solutions','technology','about','network','resources','customers','contact','settings'], active: true, createdAt: '2024-01-01' },
    { id: '3', email: HR_EMAIL, name: 'HR Admin', role: 'hr', permissions: ['dashboard','careers','settings'], active: true, createdAt: '2024-01-01' },
  ];

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ ok: false, error: 'EMAIL_EXISTS' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userPermissions = Array.isArray(permissions) ? permissions.filter((p) => typeof p === 'string') : [];
  const newUser = {
    id: crypto.randomBytes(12).toString('base64url'),
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role,
    permissions: userPermissions,
    active: active !== false,
    createdAt: new Date().toISOString().slice(0, 10),
    passwordHash,
  };

  const updatedUsers = [...users, newUser];
  await setContentValue('adminUsers', updatedUsers);

  res.json({ ok: true, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, permissions: newUser.permissions, active: newUser.active, createdAt: newUser.createdAt } });
});

app.post('/api/admin/users/update', requireAuth, requireSuperAdmin, async (req, res) => {
  const { id, email, name, role, password, active, permissions } = req.body ?? {};
  if (!id || !email || !name || !role) {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }
  if (!['super_admin', 'content', 'hr', 'sales'].includes(role)) {
    return res.status(400).json({ ok: false, error: 'INVALID_ROLE' });
  }

  const users = (await getContentValue('adminUsers')) ?? [
    { id: '1', email: SUPER_ADMIN_EMAIL, name: 'Super Admin', role: 'super_admin', permissions: ['dashboard','home','tgcs','solutions','technology','about','network','resources','customers','contact','careers','settings','users'], active: true, createdAt: '2024-01-01' },
    { id: '2', email: CONTENT_EMAIL, name: 'Content Admin', role: 'content', permissions: ['dashboard','home','tgcs','solutions','technology','about','network','resources','customers','contact','settings'], active: true, createdAt: '2024-01-01' },
    { id: '3', email: HR_EMAIL, name: 'HR Admin', role: 'hr', permissions: ['dashboard','careers','settings'], active: true, createdAt: '2024-01-01' },
  ];

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND' });
  }

  const emailConflict = users.find((u) => u.id !== id && u.email.toLowerCase() === email.toLowerCase());
  if (emailConflict) {
    return res.status(400).json({ ok: false, error: 'EMAIL_EXISTS' });
  }

  const userPermissions = Array.isArray(permissions) ? permissions.filter((p) => typeof p === 'string') : (users[userIndex].permissions ?? []);
  const updatedUser = {
    ...users[userIndex],
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role,
    permissions: userPermissions,
    active: active !== false,
  };

  if (password && password.length >= 6) {
    updatedUser.passwordHash = await bcrypt.hash(password, 10);
  }

  const updatedUsers = [...users];
  updatedUsers[userIndex] = updatedUser;
  await setContentValue('adminUsers', updatedUsers);

  res.json({ ok: true, user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role, permissions: updatedUser.permissions, active: updatedUser.active, createdAt: updatedUser.createdAt } });
});

app.post('/api/admin/users/delete', requireAuth, requireSuperAdmin, async (req, res) => {
  const { id } = req.body ?? {};
  if (!id) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  // Prevent deleting yourself
  if (id === req.auth.userId) {
    return res.status(400).json({ ok: false, error: 'CANNOT_DELETE_SELF' });
  }

  const users = (await getContentValue('adminUsers')) ?? [];
  const updatedUsers = users.filter((u) => u.id !== id);
  await setContentValue('adminUsers', updatedUsers);

  res.json({ ok: true });
});

// --- Image Upload ---
app.post('/api/admin/upload-image', requireAuth, requireAdminAny, (req, res) => {
  imageUpload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ ok: false, error: 'FILE_TOO_LARGE', message: 'Max file size is 5MB' });
      }
      return res.status(400).json({ ok: false, error: 'UPLOAD_FAILED' });
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'NO_FILE' });
    }
    const url = `/uploads/images/${req.file.filename}`;
    return res.json({ ok: true, url });
  });
});

// --- Contact Messages ---
function defaultContactMessages() {
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@telkom.co.id',
      phone: '+62 812-3456-7890',
      company: 'PT. Telkom Indonesia',
      subject: 'Inquiry about Dedicated Connectivity',
      message: 'We are interested in your 10 Gbps dedicated fiber service for our Jakarta office. Please send us a quotation.',
      date: '2026-01-02 10:30',
      status: 'new',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@bca.co.id',
      phone: '+62 813-9876-5432',
      company: 'Bank Central Asia',
      subject: 'SD-WAN Solution for Multi-Branch',
      message: 'We need SD-WAN solution to connect 50+ branches across Indonesia. Can we schedule a meeting?',
      date: '2026-01-02 09:15',
      status: 'read',
    },
    {
      id: '3',
      name: 'Ahmad Rahman',
      email: 'ahmad.rahman@pertamina.com',
      phone: '+62 821-5555-6666',
      company: 'PT. Pertamina',
      subject: 'Cloud Interconnection Services',
      message: 'Looking for direct connection to AWS and Azure for our enterprise applications.',
      date: '2026-01-01 16:45',
      status: 'responded',
    },
  ];
}

function validateContactMessages(input) {
  if (!Array.isArray(input)) return null;
  if (input.length > 10000) return null;
  const allowedStatus = new Set(['new', 'read', 'responded']);
  const next = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'string' ? item.id : null;
    const name = typeof item.name === 'string' ? item.name : null;
    const email = typeof item.email === 'string' ? item.email : null;
    const phone = typeof item.phone === 'string' ? item.phone : '';
    const company = typeof item.company === 'string' ? item.company : '';
    const subject = typeof item.subject === 'string' ? item.subject : '';
    const message = typeof item.message === 'string' ? item.message : '';
    const date = typeof item.date === 'string' ? item.date : '';
    const status = typeof item.status === 'string' ? item.status : 'new';
    if (!id || !name || !email) return null;
    if (!allowedStatus.has(status)) return null;
    next.push({ id, name, email, phone, company, subject, message, date, status });
  }
  return next;
}

app.get('/api/admin/content/contact-messages', requireAuth, requireContentAdmin, async (_req, res) => {
  const store = await readContentStore();
  const messages = store.contactMessages ?? defaultContactMessages();
  res.json({ ok: true, messages });
});

app.put('/api/admin/content/contact-messages', requireAuth, requireContentAdmin, async (req, res) => {
  const messages = validateContactMessages(req.body?.messages);
  if (!messages) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, contactMessages: messages, contactMessagesUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

// Public contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, subject, message } = req.body ?? {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }
  if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }
  if (name.length > 200 || email.length > 320 || subject.length > 500 || message.length > 10000) {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }

  const newMessage = {
    id: crypto.randomBytes(12).toString('base64url'),
    name: name.trim(),
    email: email.trim(),
    phone: typeof phone === 'string' ? phone.trim() : '',
    company: typeof company === 'string' ? company.trim() : '',
    subject: subject.trim(),
    message: message.trim(),
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    status: 'new',
  };

  await withContentWrite(async () => {
    const store = await readContentStore();
    const existing = store.contactMessages ?? defaultContactMessages();
    const next = [newMessage, ...existing].slice(0, 10000);
    await writeContentStore({ ...store, contactMessages: next, contactMessagesUpdatedAt: nowMs() });
  });

  res.json({ ok: true, id: newMessage.id });
});

// --- Network Coverage ---
function defaultNetworkCoverage() {
  return {
    title: 'Network Coverage',
    description: 'SuperCorridor network spans across major cities in Indonesia',
    totalPops: 150,
    totalCities: 50,
    cities: [
      { id: '1', name: 'Jakarta', province: 'DKI Jakarta', pops: 25, status: 'active' },
      { id: '2', name: 'Surabaya', province: 'Jawa Timur', pops: 15, status: 'active' },
      { id: '3', name: 'Bandung', province: 'Jawa Barat', pops: 12, status: 'active' },
      { id: '4', name: 'Medan', province: 'Sumatera Utara', pops: 10, status: 'active' },
      { id: '5', name: 'Semarang', province: 'Jawa Tengah', pops: 8, status: 'active' },
    ],
  };
}

function validateNetworkCoverage(input) {
  if (!input || typeof input !== 'object') return null;
  const title = typeof input.title === 'string' ? input.title : null;
  const description = typeof input.description === 'string' ? input.description : null;
  const totalPops = typeof input.totalPops === 'number' ? input.totalPops : null;
  const totalCities = typeof input.totalCities === 'number' ? input.totalCities : null;
  if (!title || !description || totalPops === null || totalCities === null) return null;

  const cities = [];
  if (Array.isArray(input.cities)) {
    for (const c of input.cities) {
      if (!c || typeof c !== 'object') return null;
      const id = typeof c.id === 'string' ? c.id : null;
      const name = typeof c.name === 'string' ? c.name : null;
      const province = typeof c.province === 'string' ? c.province : null;
      const pops = typeof c.pops === 'number' ? c.pops : null;
      const status = typeof c.status === 'string' ? c.status : null;
      if (!id || !name || !province || pops === null || !status) return null;
      if (status !== 'active' && status !== 'coming-soon') return null;
      cities.push({ id, name, province, pops, status });
    }
  }

  return { title, description, totalPops, totalCities, cities };
}

app.get('/api/admin/content/network-coverage', requireAuth, requireContentAdmin, async (_req, res) => {
  const store = await readContentStore();
  const networkCoverage = store.networkCoverage ?? defaultNetworkCoverage();
  res.json({ ok: true, networkCoverage });
});

app.put('/api/admin/content/network-coverage', requireAuth, requireContentAdmin, async (req, res) => {
  const networkCoverage = validateNetworkCoverage(req.body?.networkCoverage);
  if (!networkCoverage) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    await writeContentStore({ ...store, networkCoverage, networkCoverageUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

// --- Settings ---
function validateSettings(input) {
  if (!input || typeof input !== 'object') return null;
  const result = {};

  if (input.profile && typeof input.profile === 'object') {
    result.profile = {
      name: typeof input.profile.name === 'string' ? input.profile.name : 'Admin User',
      email: typeof input.profile.email === 'string' ? input.profile.email : '',
      phone: typeof input.profile.phone === 'string' ? input.profile.phone : '',
    };
  }

  if (input.notifications && typeof input.notifications === 'object') {
    result.notifications = {
      contactMessages: typeof input.notifications.contactMessages === 'boolean' ? input.notifications.contactMessages : true,
      jobApplications: typeof input.notifications.jobApplications === 'boolean' ? input.notifications.jobApplications : true,
      weeklySummary: typeof input.notifications.weeklySummary === 'boolean' ? input.notifications.weeklySummary : false,
      systemUpdates: typeof input.notifications.systemUpdates === 'boolean' ? input.notifications.systemUpdates : true,
    };
  }

  if (input.website && typeof input.website === 'object') {
    result.website = {
      name: typeof input.website.name === 'string' ? input.website.name : 'SuperCorridor',
      phone: typeof input.website.phone === 'string' ? input.website.phone : '',
      email: typeof input.website.email === 'string' ? input.website.email : '',
      address: typeof input.website.address === 'string' ? input.website.address : '',
    };
  }

  return Object.keys(result).length > 0 ? result : null;
}

app.get('/api/admin/content/settings', requireAuth, requireAdminAny, async (_req, res) => {
  const store = await readContentStore();
  const settings = store.settings ?? null;
  res.json({ ok: true, settings });
});

app.put('/api/admin/content/settings', requireAuth, requireAdminAny, async (req, res) => {
  const settings = validateSettings(req.body?.settings);
  if (!settings) return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });

  await withContentWrite(async () => {
    const store = await readContentStore();
    const existing = store.settings ?? {};
    await writeContentStore({ ...store, settings: { ...existing, ...settings }, settingsUpdatedAt: nowMs() });
  });

  res.json({ ok: true });
});

// --- Change Password ---
app.post('/api/admin/change-password', requireAuth, requireAdminAny, async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword ?? '');
    const newPassword = String(req.body?.newPassword ?? '');

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ ok: false, error: 'PASSWORD_TOO_SHORT' });
    }

    // Verify current password
    const accounts = [
      { id: '1', email: SUPER_ADMIN_EMAIL, passwordHash: SUPER_ADMIN_PASSWORD_HASH, passwordPlain: SUPER_ADMIN_PASSWORD, devFallbackPassword: 'admin123' },
      { id: '2', email: CONTENT_EMAIL, passwordHash: CONTENT_PASSWORD_HASH, passwordPlain: CONTENT_PASSWORD, devFallbackPassword: 'content123' },
      { id: '3', email: HR_EMAIL, passwordHash: HR_PASSWORD_HASH, passwordPlain: HR_PASSWORD, devFallbackPassword: 'hr123' },
    ];

    const account = accounts.find((a) => a.id === req.auth.userId);
    if (!account) return res.status(400).json({ ok: false, error: 'INVALID_PASSWORD' });

    const passwordOk = account.passwordHash
      ? await bcrypt.compare(currentPassword, account.passwordHash)
      : account.passwordPlain
        ? currentPassword === account.passwordPlain
        : currentPassword === account.devFallbackPassword;

    if (!passwordOk) {
      return res.status(400).json({ ok: false, error: 'INVALID_PASSWORD' });
    }

    // Note: In a real production system, you'd update the password hash in a database.
    // Since this uses env vars for auth, we store the new hash in the content store for dev purposes.
    const newHash = await bcrypt.hash(newPassword, 10);
    await withContentWrite(async () => {
      const store = await readContentStore();
      const passwordOverrides = store.passwordOverrides ?? {};
      passwordOverrides[req.auth.userId] = newHash;
      await writeContentStore({ ...store, passwordOverrides, passwordOverridesUpdatedAt: nowMs() });
    });

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: 'INTERNAL' });
  }
});

// --- Dashboard Stats ---
app.get('/api/admin/dashboard-stats', requireAuth, requireAdminAny, async (_req, res) => {
  const store = await readContentStore();
  const contactMessages = store.contactMessages ?? defaultContactMessages();
  const applications = store.careersApplications ?? defaultCareersApplications();

  const stats = {
    totalMessages: contactMessages.length,
    newMessages: contactMessages.filter((m) => m.status === 'new').length,
    totalApplications: applications.length,
    newApplications: applications.filter((a) => a.status === 'new').length,
  };

  res.json({ ok: true, stats });
});

// --- Generic Page Content ---
// A flexible endpoint for storing/retrieving page content by key.
// Used by Solutions, About, and other pages that need simple content management.
const ALLOWED_PAGE_KEYS = new Set([
  'solutions-all',
  'technology-all',
  'tgcs-extended',
  'solutions-dedicated-connectivity',
  'solutions-backbone-network',
  'solutions-cloud-interconnection',
  'solutions-value-added-services',
  'about-company-overview',
  'about-vision-mission',
  'about-leadership',
  'about-milestones',
]);

app.get('/api/admin/content/pages/:key', requireAuth, requireContentAdmin, async (req, res) => {
  const key = req.params.key;
  if (!ALLOWED_PAGE_KEYS.has(key)) {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
  }
  const data = await getPageContent(key);
  res.json({ ok: true, data });
});

app.put('/api/admin/content/pages/:key', requireAuth, requireContentAdmin, async (req, res) => {
  const key = req.params.key;
  if (!ALLOWED_PAGE_KEYS.has(key)) {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
  }
  const data = req.body?.data;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
  }

  await setPageContent(key, data);
  res.json({ ok: true });
});

// Public page content endpoint
app.get('/api/content/pages/:key', async (req, res) => {
  const key = req.params.key;
  if (!ALLOWED_PAGE_KEYS.has(key)) {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
  }
  const data = await getPageContent(key);
  res.json({ ok: true, data });
});

// ── Enterprise API Routes ──────────────────────────────────────────
import { createEnterpriseRouter } from './enterprise/routes.mjs';
const enterpriseRouter = createEnterpriseRouter(requireAuth, requireSalesAdmin, getContentValue, setContentValue);
app.use('/api/enterprise', enterpriseRouter);

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    assertProductionConfig();
    console.log(`API listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});
