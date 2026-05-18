import { query, pool } from './db.mjs';

await query('TRUNCATE content_store, contact_messages, refresh_tokens, careers_applications, page_content, settings RESTART IDENTITY');
console.log('All tables cleared');
await pool.end();
