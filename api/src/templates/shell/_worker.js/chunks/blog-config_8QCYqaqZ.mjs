globalThis.process ??= {}; globalThis.process.env ??= {};
async function loadBlogConfig(db) {
  const configResult = await db.prepare("SELECT key, value FROM config").all();
  return Object.fromEntries(
    configResult.results.map((r) => [r.key, r.value])
  );
}

export { loadBlogConfig as l };
