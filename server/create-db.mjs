/**
 * Create the PostgreSQL database for SuperCorridor
 * 
 * Usage:
 *   node server/create-db.mjs
 * 
 * Prerequisites:
 *   - PostgreSQL running on localhost:5432
 *   - User 'postgres' with password 'postgres' (or set PGUSER/PGPASSWORD env vars)
 * 
 * This script creates the 'supercorridor' database if it doesn't exist.
 */

import pg from 'pg';

const { Client } = pg;

const dbName = process.env.DB_NAME ?? 'supercorridor';
const adminUrl = process.env.PG_ADMIN_URL ?? 'postgresql://postgres:Corei7gen@localhost:5432/postgres';

async function createDatabase() {
  const client = new Client({ connectionString: adminUrl });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`ℹ️  Database '${dbName}' already exists`);
    }

    console.log('\nNext steps:');
    console.log(`  1. Run seed: node server/seed.mjs`);
    console.log(`  2. Start server: node server/index.mjs`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
