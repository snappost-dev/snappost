-- Davet e-postaları (D1). `ALLOWED_EMAILS` env ile birleşim; ikisi de boş = kısıt yok.
CREATE TABLE IF NOT EXISTS allowed_emails (
  email TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
