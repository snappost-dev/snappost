#!/usr/bin/env bash
# API duman testleri — secret'ları dosyaya yazmayın; env kullanın.
# Gerekli: SMOKE_API_URL (örn. https://snappost-api.xxx.workers.dev, sonunda / yok)
# İsteğe bağlı: SMOKE_EMAIL, SMOKE_PASSWORD — tanımlıysa login + GET /api/sites test edilir.

set -euo pipefail

BASE="${SMOKE_API_URL:-}"
if [[ -z "$BASE" ]]; then
  echo "SMOKE_API_URL tanımlı değil." >&2
  exit 1
fi

# Sondaki / kaldır
BASE="${BASE%/}"

pass() { echo "OK  $*"; }
fail() { echo "FAIL $*" >&2; exit 1; }

code_for() {
  local method="$1"
  local url="$2"
  shift 2
  curl -sS -o /dev/null -w '%{http_code}' -X "$method" "$url" "$@"
}

echo "== Smoke API: $BASE"

# T1 — health
c=$(code_for GET "$BASE/")
[[ "$c" == "200" ]] || fail "GET / beklenen 200, gelen: $c"
pass "GET / -> 200"

# R2 / medya (B1)
c=$(code_for GET "$BASE/api/media/status")
[[ "$c" == "200" ]] || fail "GET /api/media/status beklenen 200, gelen: $c"
pass "GET /api/media/status -> 200"

# T2 — sites without auth
c=$(code_for GET "$BASE/api/sites")
[[ "$c" == "401" ]] || fail "GET /api/sites (no auth) beklenen 401, gelen: $c"
pass "GET /api/sites (no Bearer) -> 401"

# Register probe — 400 (geçersiz body), 403 (whitelist), veya API ayarına göre başka; sunucu yanıt veriyor olmalı
c=$(code_for POST "$BASE/api/auth/register" \
  -H 'Content-Type: application/json' \
  -d '{}')
[[ "$c" == "400" || "$c" == "403" ]] || fail "POST /api/auth/register {} beklenen 400 veya 403, gelen: $c"
pass "POST /api/auth/register (empty JSON) -> $c"

# /test/* kapalı mı (production)
c=$(code_for GET "$BASE/test/d1")
[[ "$c" == "404" ]] || fail "GET /test/d1 beklenen 404 (ALLOW_TEST_ROUTES kapalı), gelen: $c"
pass "GET /test/d1 -> 404"

# Opsiyonel: login + me + sites
if [[ -n "${SMOKE_EMAIL:-}" && -n "${SMOKE_PASSWORD:-}" ]]; then
  resp=$(curl -sS -X POST "$BASE/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$SMOKE_EMAIL\",\"password\":\"$SMOKE_PASSWORD\"}")
  token=$(printf '%s' "$resp" | node -e "
    let j;
    try { j = JSON.parse(require('fs').readFileSync(0, 'utf8')); } catch (e) { process.exit(1); }
    if (!j.token) process.exit(1);
    process.stdout.write(String(j.token));
  ") || true
  if [[ -z "$token" ]]; then
    fail "Login başarısız veya token parse edilemedi (whitelist/credentials kontrol edin)"
  fi
  pass "POST /api/auth/login -> token alındı"

  c=$(code_for GET "$BASE/api/auth/me" -H "Authorization: Bearer $token")
  [[ "$c" == "200" ]] || fail "GET /api/auth/me beklenen 200, gelen: $c"
  pass "GET /api/auth/me -> 200"

  c=$(code_for GET "$BASE/api/sites" -H "Authorization: Bearer $token")
  [[ "$c" == "200" ]] || fail "GET /api/sites (Bearer) beklenen 200, gelen: $c"
  pass "GET /api/sites (Bearer) -> 200"
else
  echo "SKIP  SMOKE_EMAIL/SMOKE_PASSWORD yok — login/sites atlandı"
fi

echo "== Tüm duman testleri tamam"
