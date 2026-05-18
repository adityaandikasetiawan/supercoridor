import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:Corei7gen@localhost:5432/supercorridor',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function getClient() {
  return pool.connect();
}

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_store (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT DEFAULT '',
        company TEXT DEFAULT '',
        subject TEXT DEFAULT '',
        message TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        jti TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token_hash TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        expires_at BIGINT NOT NULL,
        revoked_at BIGINT,
        replaced_by_jti TEXT
      );

      CREATE TABLE IF NOT EXISTS page_content (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Database tables initialized');
  } finally {
    client.release();
  }
}

// --- Content Store helpers (for backward compatibility) ---
export async function getContentValue(key) {
  const result = await query('SELECT value FROM content_store WHERE key = $1', [key]);
  if (result.rows.length === 0) return null;
  return result.rows[0].value;
}

export async function setContentValue(key, value) {
  await query(
    `INSERT INTO content_store (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );
}

// --- Page Content helpers ---
export async function getPageContent(key) {
  const result = await query('SELECT data FROM page_content WHERE key = $1', [key]);
  if (result.rows.length === 0) return null;
  return result.rows[0].data;
}

export async function setPageContent(key, data) {
  await query(
    `INSERT INTO page_content (key, data, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [key, JSON.stringify(data)]
  );
}

// --- Contact Messages ---
export async function getContactMessages() {
  const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    subject: row.subject,
    message: row.message,
    status: row.status,
    date: row.created_at ? new Date(row.created_at).toISOString().slice(0, 16).replace('T', ' ') : '',
  }));
}

export async function insertContactMessage(msg) {
  await query(
    `INSERT INTO contact_messages (id, name, email, phone, company, subject, message, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [msg.id, msg.name, msg.email, msg.phone, msg.company, msg.subject, msg.message, msg.status ?? 'new']
  );
}

export async function updateContactMessageStatus(id, status) {
  await query('UPDATE contact_messages SET status = $1 WHERE id = $2', [status, id]);
}

export async function deleteContactMessage(id) {
  await query('DELETE FROM contact_messages WHERE id = $1', [id]);
}

// --- Refresh Tokens ---
export async function getRefreshToken(jti) {
  const result = await query('SELECT * FROM refresh_tokens WHERE jti = $1', [jti]);
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    userId: row.user_id,
    tokenHash: row.token_hash,
    createdAt: Number(row.created_at),
    expiresAt: Number(row.expires_at),
    revokedAt: row.revoked_at ? Number(row.revoked_at) : null,
    replacedByJti: row.replaced_by_jti,
  };
}

export async function insertRefreshToken(jti, data) {
  await query(
    `INSERT INTO refresh_tokens (jti, user_id, token_hash, created_at, expires_at, revoked_at, replaced_by_jti)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [jti, data.userId, data.tokenHash, data.createdAt, data.expiresAt, data.revokedAt, data.replacedByJti]
  );
}

export async function revokeRefreshToken(jti, revokedAt, replacedByJti) {
  await query(
    'UPDATE refresh_tokens SET revoked_at = $1, replaced_by_jti = $2 WHERE jti = $3',
    [revokedAt, replacedByJti ?? null, jti]
  );
}

export async function revokeAllUserTokens(userId, revokedAt) {
  await query(
    'UPDATE refresh_tokens SET revoked_at = $1 WHERE user_id = $2 AND revoked_at IS NULL',
    [revokedAt, userId]
  );
}

// --- Settings ---
export async function getSetting(key) {
  const result = await query('SELECT value FROM settings WHERE key = $1', [key]);
  if (result.rows.length === 0) return null;
  return result.rows[0].value;
}

export async function setSetting(key, value) {
  await query(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );
}

export { pool };
