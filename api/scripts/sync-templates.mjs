/**
 * Astro `dist/` çıktısını API’nin embed kaynağına kopyalar.
 * Çalıştırma dizini: `api/` (örn. `npm run sync-templates`)
 */
import { cpSync, existsSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, '..');
const repoRoot = join(apiRoot, '..');

function syncTemplate(name) {
  const src = join(repoRoot, 'templates', name, 'dist');
  const dest = join(apiRoot, 'src', 'templates', name);
  if (!existsSync(src)) {
    console.error(`[sync-templates] Kaynak yok: ${src}`);
    console.error(`Önce: cd templates/${name} && npm run build`);
    process.exit(1);
  }
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  console.log(`[sync-templates] ${name}: dist → api/src/templates/${name}`);
}

syncTemplate('shell');
syncTemplate('dashboard');
console.log('[sync-templates] Tamam — ardından: npm run embed');
