#!/bin/bash
# Snappost Shell - Quick Start Script

set -e

echo "🚀 Snappost Shell - Phase 1A Setup"
echo "===================================="
echo ""

# Step 1: Create D1 database
echo "📦 Step 1: Creating D1 database..."
wrangler d1 create snappost-shell-dev

echo ""
echo "⚠️  IMPORTANT: Copy the database_id from above output"
echo "    and paste it in wrangler.toml"
echo ""
read -p "Press Enter after you've updated wrangler.toml..."

# Step 2: Apply schema
echo ""
echo "📝 Step 2: Applying database schema..."
wrangler d1 execute snappost-shell-dev --local --file=schema.sql

# Step 3: Load seed data
echo ""
echo "🌱 Step 3: Loading seed data..."
wrangler d1 execute snappost-shell-dev --local --file=seed.sql

# Step 4: Verify data
echo ""
echo "✅ Step 4: Verifying data..."
wrangler d1 execute snappost-shell-dev --local --command="SELECT COUNT(*) as post_count FROM posts"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. npm install"
echo "2. npm run dev"
echo "3. Open http://localhost:8788"
echo ""
