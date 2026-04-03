# Snappost

Monorepo for Snappost blog platform.

## Structure

```
snappost/
├── templates/
│   ├── shell/      # Blog frontend (Astro + Cloudflare Pages)
│   └── dashboard/  # Admin panel (Astro + D1)
└── shared/         # Shared resources (schema, seed data)
```

## Setup

### Shell (Blog)
```bash
cd templates/shell
npm install
npm run dev
```

### Dashboard (Admin)
```bash
cd templates/dashboard
npm install
npm run dev
```

## Database

Both projects share the same Cloudflare D1 database.

Run setup:
```bash
cd templates/shell
./setup.sh
```
