-- Snappost Shell Database Schema
-- D1 (SQLite) schema

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,        -- Markdown source
  content_html TEXT NOT NULL,   -- Rendered HTML
  published INTEGER DEFAULT 0,  -- 0 = draft, 1 = published
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Site configuration
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Default configuration
INSERT INTO config (key, value) VALUES 
  ('site_title', 'My Blog'),
  ('site_description', 'Welcome to my blog'),
  ('author_name', 'Blog Author'),
  ('author_bio', 'Writer and thinker'),
  ('theme_color', '#3b82f6');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
