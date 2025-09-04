const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function init() {
  // create tables if they don't exist (simple migrations)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  failed_attempts INTEGER DEFAULT 0,
  locked_until BIGINT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      jti TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id),
      token_hash TEXT NOT NULL,
      issued_at BIGINT,
      expires_at BIGINT,
      revoked BOOLEAN DEFAULT FALSE,
      replaced_by_jti TEXT,
      last_used_at BIGINT,
      ip TEXT,
      user_agent TEXT
    );
  `);
}

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, init, query };
