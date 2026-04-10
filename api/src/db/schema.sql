-- Provisioning API Central Database Schema
-- This database tracks all users and their deployed sites

-- Users table - email/password authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sites table - tracks each user's deployed blog instances
CREATE TABLE IF NOT EXISTS sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  site_name TEXT NOT NULL,
  d1_database_id TEXT,
  shell_project_name TEXT,
  shell_url TEXT,
  dashboard_project_name TEXT,
  dashboard_url TEXT,
  access_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | provisioning | active | failed
  error_message TEXT,
  custom_domain TEXT DEFAULT NULL, -- blog (shell Pages) custom hostname; dashboard uses *.pages.dev only
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, site_name)
);

-- Mevcut uzak D1 (provisioning) için bir kez:
-- wrangler d1 execute snappost-provisioning --remote --command="ALTER TABLE sites ADD COLUMN custom_domain TEXT DEFAULT NULL"
-- Yerel: ... --local --file=... veya aynı --command ile --local

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);

CREATE TABLE IF NOT EXISTS allowed_emails (
  email TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
