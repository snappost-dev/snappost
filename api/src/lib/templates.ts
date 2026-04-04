import { shellFiles, shellWorkerBundle, shellRoutesJson, type TemplateFile } from '../generated/shell-template';
import { dashboardFiles, dashboardWorkerBundle, dashboardRoutesJson } from '../generated/dashboard-template';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getContentType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.'));
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export type PreparedFile = {
  path: string;
  base64: string;
  size: number;
  contentType: string;
  hash: string;
};

async function hashFile(base64: string, path: string): Promise<string> {
  const raw = atob(base64);
  const combined = raw + path;
  const data = new TextEncoder().encode(combined);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function prepareFiles(files: TemplateFile[]): Promise<PreparedFile[]> {
  return Promise.all(
    files.map(async (f) => ({
      path: f.path,
      base64: f.base64,
      size: f.size,
      contentType: getContentType(f.path),
      hash: await hashFile(f.base64, f.path),
    }))
  );
}

export type PreparedTemplate = {
  files: PreparedFile[];
  workerBundle: string | null;
  routesJson: string | null;
};

export async function prepareShellTemplate(): Promise<PreparedTemplate> {
  return {
    files: await prepareFiles(shellFiles),
    workerBundle: shellWorkerBundle,
    routesJson: shellRoutesJson,
  };
}

export async function prepareDashboardTemplate(): Promise<PreparedTemplate> {
  return {
    files: await prepareFiles(dashboardFiles),
    workerBundle: dashboardWorkerBundle,
    routesJson: dashboardRoutesJson,
  };
}

// Her user'ın D1 database'ine execute edilecek blog schema
export const BLOG_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  content_html TEXT NOT NULL,
  published INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO config (key, value) VALUES 
  ('site_title', 'My Blog'),
  ('site_description', 'Welcome to my blog'),
  ('author_name', 'Blog Author'),
  ('author_bio', 'Writer and thinker'),
  ('theme_color', '#3b82f6');

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
`;
