import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { build } from 'esbuild';

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

async function bundleWorkerJS(workerDir) {
  const entryPoint = join(workerDir, 'index.js');
  if (!existsSync(entryPoint)) return null;

  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    target: 'es2022',
    minify: false,
    write: false,
    outfile: '_worker.bundle',
  });

  const bundled = result.outputFiles[0].text;
  console.log(`  _worker.bundle: ${(bundled.length / 1024).toFixed(1)} KB`);
  return Buffer.from(bundled).toString('base64');
}

async function embedTemplate(name, sourceDir, outFile) {
  const files = walkDir(sourceDir);

  // Static assets = everything outside _worker.js/
  const staticFiles = files.filter(f => !relative(sourceDir, f).startsWith('_worker.js/'));
  const entries = staticFiles.map(f => {
    const relPath = '/' + relative(sourceDir, f);
    const content = readFileSync(f);
    return { path: relPath, base64: content.toString('base64'), size: content.length };
  });

  // Bundle _worker.js/ directory into a single file
  const workerDir = join(sourceDir, '_worker.js');
  let workerBundle = null;
  if (existsSync(workerDir)) {
    workerBundle = await bundleWorkerJS(workerDir);
  }

  // Read _routes.json if exists
  const routesPath = join(sourceDir, '_routes.json');
  let routesJson = null;
  if (existsSync(routesPath)) {
    routesJson = readFileSync(routesPath, 'utf-8');
  }

  const code = [
    '// Auto-generated - do not edit',
    '// Run: node scripts/embed-templates.mjs',
    '',
    'export type TemplateFile = { path: string; base64: string; size: number };',
    '',
    `export const ${name}Files: TemplateFile[] = ${JSON.stringify(entries, null, 2)};`,
    '',
    `export const ${name}WorkerBundle: string | null = ${workerBundle ? JSON.stringify(workerBundle) : 'null'};`,
    '',
    `export const ${name}RoutesJson: string | null = ${routesJson ? JSON.stringify(routesJson) : 'null'};`,
    '',
  ].join('\n');

  writeFileSync(outFile, code, 'utf-8');
  console.log(`${name}: ${entries.length} static files + worker bundle → ${outFile}`);
}

mkdirSync('src/generated', { recursive: true });

await embedTemplate('shell', 'src/templates/shell', 'src/generated/shell-template.ts');
await embedTemplate('dashboard', 'src/templates/dashboard', 'src/generated/dashboard-template.ts');

console.log('Done.');
