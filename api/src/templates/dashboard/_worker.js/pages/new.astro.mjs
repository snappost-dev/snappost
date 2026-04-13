globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, r as renderTemplate, b as renderHead, e as createAstro } from '../chunks/astro/server_CZTmva32.mjs';
/* empty css                                 */
import { r as renderEditorJSToHTML } from '../chunks/editor-html_WvNIgpGN.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  let error = "";
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const title = formData.get("title");
      const slug = formData.get("slug");
      const description = formData.get("description");
      const contentRaw = formData.get("content");
      const published = formData.get("published") === "1" ? 1 : 0;
      if (!title || !slug || !contentRaw) {
        error = "Title, slug, and content are required";
      } else {
        const contentJson = JSON.parse(contentRaw);
        const content_html = renderEditorJSToHTML(contentJson);
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const insertResult = await Astro2.locals.runtime.env.DB.prepare("INSERT INTO posts (slug, title, description, content, content_html, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(slug, title, description, contentRaw, content_html, published, now, now).run();
        const rawId = insertResult.meta?.last_row_id;
        const newId = rawId != null ? Number(rawId) : NaN;
        if (Number.isFinite(newId) && newId > 0) {
          return Astro2.redirect(`/edit/${newId}`);
        }
        return Astro2.redirect("/");
      }
    } catch (e) {
      error = "Error creating post: " + e.message;
    }
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Post - Dashboard</title><style>\n    .editor-grid { display: grid; grid-template-columns: 300px 1fr; height: 100vh; }\n    .sidebar { background: #f8fafc; border-right: 1px solid #e2e8f0; overflow-y: auto; }\n    .editor-main { overflow-y: auto; }\n    .nav-item { cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }\n    .nav-item:hover { background: #e2e8f0; }\n    .nav-item.active { background: #dbeafe; color: #1d4ed8; }\n    .ce-block--focused { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 4px; }\n    #editorjs { min-height: 400px; }\n    .codex-editor__redactor { padding-bottom: 200px !important; }\n  </style>', '</head> <body class="bg-gray-50" data-theme="corporate"> ', ` <form method="POST" id="save-form"> <input type="hidden" name="content" id="hidden-content"> <input type="hidden" name="title" id="hidden-title"> <input type="hidden" name="slug" id="hidden-slug"> <input type="hidden" name="description" id="hidden-description"> <input type="hidden" name="published" id="hidden-published" value="0"> </form> <div class="editor-grid"> <!-- SIDEBAR --> <aside class="sidebar flex flex-col"> <div class="p-4 border-b border-gray-200"> <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Posts</a> </div> <!-- Navigator --> <div class="p-4 flex-1"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Blocks</h3> <div id="block-list" class="space-y-1"> <div class="text-sm text-gray-400 italic">Start writing...</div> </div> <p class="text-xs text-gray-400 mt-3 leading-relaxed">Add blocks with the <strong>+</strong> in the editor.</p> </div> <!-- Properties --> <div class="border-t border-gray-200 p-4"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Properties</h3> <div id="properties-content"> <p class="text-sm text-gray-400 italic">Select a block</p> </div> </div> </aside> <!-- MAIN PANEL --> <main class="editor-main"> <!-- Navbar --> <div class="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-3"> <div class="max-w-3xl mx-auto flex items-center gap-3"> <input id="post-title" type="text" placeholder="Post title..." class="input input-bordered input-sm flex-1 font-semibold text-lg"> <input id="post-slug" type="text" placeholder="slug" class="input input-bordered input-sm w-40 text-xs font-mono"> <label class="flex items-center gap-1.5 text-sm cursor-pointer"> <input type="checkbox" id="post-published" class="checkbox checkbox-sm checkbox-primary"> <span>Publish</span> </label> <button id="preview-btn" class="btn btn-ghost btn-sm">Preview</button> <button id="save-btn" class="btn btn-primary btn-sm">Save</button> </div> <div class="max-w-3xl mx-auto mt-2"> <input id="post-description" type="text" placeholder="Short description (optional)" class="input input-bordered input-xs w-full"> </div> </div> <!-- Editor --> <div class="max-w-3xl mx-auto px-6 py-8"> <div id="editorjs"></div> </div> </main> </div> <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.30.6/dist/editorjs.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/paragraph@2.11.7/dist/paragraph.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/nested-list@1.4.3/dist/nested-list.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@sotaproject/strikethrough@1.0.1/dist/bundle.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/header@2.8.8/dist/header.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@2.6.0/dist/quote.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/code@2.9.0/dist/code.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@1.4.2/dist/delimiter.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/image@2.9.0/dist/image.umd.js"><\/script> <script src="/dashboard/alert-block.js"><\/script> <script>
// ==========================================
// State (AlertBlock: /dashboard/alert-block.js \u2192 SnappostAlertBlock)
// ==========================================
let editor;
let activeBlockIndex = null;
let navigatorDebounce = null;
let editorBootStarted = false;

window.addEventListener('pageshow', (e) => {
  if (e.persisted) location.reload();
});

// ==========================================
// Editor.js Init
// ==========================================
function boot() {
  const StrikethroughTool = window.Strikethrough && (window.Strikethrough.default || window.Strikethrough);
  if (
    typeof EditorJS === 'undefined' ||
    typeof Paragraph === 'undefined' ||
    typeof NestedList === 'undefined' ||
    typeof Header === 'undefined' ||
    typeof Quote === 'undefined' ||
    typeof CodeTool === 'undefined' ||
    typeof Delimiter === 'undefined' ||
    typeof ImageTool === 'undefined' ||
    typeof window.SnappostAlertBlock === 'undefined'
  ) {
    setTimeout(boot, 50);
    return;
  }
  if (editorBootStarted) return;
  editorBootStarted = true;

  const inlineToolbar = ['bold', 'italic', 'link'];
  if (StrikethroughTool) inlineToolbar.push('strikethrough');

  const tools = {
    paragraph: {
      class: Paragraph,
      inlineToolbar,
      config: { placeholder: 'Paragraph \u2014 bold, italic, link from toolbar' },
    },
    header: {
      class: Header,
      inlineToolbar,
      config: { placeholder: 'Heading', levels: [1, 2, 3, 4], defaultLevel: 2 },
    },
    list: {
      class: NestedList,
      inlineToolbar,
      config: { defaultStyle: 'unordered' },
    },
    quote: { class: Quote, inlineToolbar },
    code: { class: CodeTool },
    delimiter: { class: Delimiter },
    image: {
      class: ImageTool,
      config: {
        /** Varsay\u0131lan ajax bazen cookie g\xF6ndermez; giri\u015Fli dashboard i\xE7in same-origin fetch */
        uploader: {
          uploadByFile(file) {
            const body = new FormData();
            body.append('file', file, file.name);
            return fetch('/api/upload-media', {
              method: 'POST',
              body,
              credentials: 'same-origin',
            }).then(async (res) => {
              const data = await res.json().catch(() => ({}));
              if (!res.ok || data.success !== 1 || !data.file?.url) {
                throw new Error(data.error || \`Upload failed (\${res.status})\`);
              }
              return data;
            });
          },
          uploadByUrl() {
            return Promise.reject(new Error('URL ile g\xF6rsel ekleme hen\xFCz kapal\u0131'));
          },
        },
      },
    },
    alert: { class: window.SnappostAlertBlock },
  };
  if (StrikethroughTool) {
    tools.strikethrough = { class: StrikethroughTool };
  }

  editor = new EditorJS({
    holder: 'editorjs',
    inlineToolbar,
    tools,
    placeholder: 'Start writing your post...',
    autofocus: true,
    onChange: () => {
      clearTimeout(navigatorDebounce);
      navigatorDebounce = setTimeout(updateNavigator, 150);
    },
  });

  document.getElementById('save-btn').addEventListener('click', savePost);
  document.getElementById('preview-btn').addEventListener('click', openPreview);

  document.getElementById('post-title').addEventListener('input', (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    document.getElementById('post-slug').value = slug;
  });

  document.addEventListener('alert-selected', (e) => {
    showAlertToolProperties(e.detail);
  });
}
document.addEventListener('DOMContentLoaded', boot);

// ==========================================
// Navigator
// ==========================================
const ICONS = { header: '\u{1F4F0}', paragraph: '\u{1F4DD}', list: '\u{1F4CB}', alert: '\u26A0\uFE0F', quote: '\u{1F4AC}', code: '\u{1F4BB}', delimiter: '\u2796', image: '\u{1F5BC}\uFE0F' };

function getBlockLabel(block) {
  switch (block.type) {
    case 'header':    return block.data.text || 'Empty header \u2014 click to edit';
    case 'paragraph': { const t = (block.data.text || '').replace(/<[^>]*>/g, ''); return (t.length > 0 ? t.substring(0, 30) + (t.length > 30 ? '\u2026' : '') : 'Empty paragraph \u2014 click to edit'); }
    case 'list':      return 'List (' + (block.data.items?.length || 0) + ' items)';
    case 'alert':     return 'Alert: ' + (block.data.type || 'info');
    case 'quote':     return (block.data.text || '').replace(/<[^>]*>/g, '').substring(0, 28) || 'Quote \u2014 click to edit';
    case 'code':      return 'Code' + ((block.data.code || '').length ? ' (' + Math.min((block.data.code || '').length, 999) + ' chars)' : '');
    case 'delimiter': return 'Divider';
    case 'image':     return 'Image';
    default:          return block.type;
  }
}

async function updateNavigator() {
  if (!editor || !editor.save) return;
  let data;
  try { data = await editor.save(); } catch { return; }

  const list = document.getElementById('block-list');
  list.innerHTML = '';

  if (data.blocks.length === 0) {
    list.innerHTML = '<div class="text-sm text-gray-400 italic">Start writing...</div>';
    return;
  }

  data.blocks.forEach((block, i) => {
    const div = document.createElement('div');
    const label = getBlockLabel(block);
    const isEmpty = label.includes('Empty') || label.includes('click to edit');
    div.className = 'nav-item' + (activeBlockIndex === i ? ' active' : '');
    div.innerHTML = '<span>' + (ICONS[block.type] || '\u{1F4C4}') + '</span><span class="truncate' + (isEmpty ? ' text-gray-400 italic' : '') + '">' + label + '</span>';
    div.addEventListener('click', () => selectBlock(i));
    list.appendChild(div);
  });
}

function selectBlock(index) {
  activeBlockIndex = index;
  updateNavigator();

  const blocks = document.querySelectorAll('.ce-block');
  if (blocks[index]) {
    blocks[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    blocks[index].querySelector('.ce-block__content')?.click();
    blocks[index].querySelector('[contenteditable]')?.focus();
  }

  showPropertiesForIndex(index);
}

// ==========================================
// Properties Panel
// ==========================================
async function showPropertiesForIndex(index) {
  let data;
  try { data = await editor.save(); } catch { return; }
  const block = data.blocks[index];
  if (!block) return;

  if (block.type === 'alert' && block.id) {
    mountAlertPropertiesByBlockId(block.id, block.data || {});
    return;
  }
  document.getElementById('properties-content').innerHTML =
    '<p class="text-sm text-gray-400 italic">Edit directly in the editor</p>';
}

/** Sidebar: uses Editor.js block id + blocks.update */
function mountAlertPropertiesByBlockId(blockId, data) {
  const type = data.type || 'info';
  const text = data.text != null ? String(data.text) : '';
  const container = document.getElementById('properties-content');
  container.innerHTML =
    '<div class="space-y-3">' +
    '<div><label class="label"><span class="label-text text-xs">Alert Type</span></label>' +
    '<select id="alert-type-select" class="select select-bordered select-sm w-full">' +
    '<option value="info"' + (type === 'info' ? ' selected' : '') + '>\u2139\uFE0F Info</option>' +
    '<option value="warning"' + (type === 'warning' ? ' selected' : '') + '>\u26A0\uFE0F Warning</option>' +
    '<option value="success"' + (type === 'success' ? ' selected' : '') + '>\u2705 Success</option>' +
    '<option value="error"' + (type === 'error' ? ' selected' : '') + '>\u274C Error</option>' +
    '</select></div>' +
    '<div><label class="label"><span class="label-text text-xs">Message</span></label>' +
    '<textarea id="alert-msg-input" class="textarea textarea-bordered textarea-sm w-full" rows="3"></textarea></div></div>';
  document.getElementById('alert-msg-input').value = text;

  document.getElementById('alert-type-select').addEventListener('change', async (e) => {
    const msg = document.getElementById('alert-msg-input').value;
    try {
      await editor.blocks.update(blockId, { text: msg, type: e.target.value });
    } catch (err) {
      console.error(err);
    }
    updateNavigator();
  });
  document.getElementById('alert-msg-input').addEventListener('input', async (e) => {
    const t = document.getElementById('alert-type-select').value;
    try {
      await editor.blocks.update(blockId, { text: e.target.value, type: t });
    } catch (err) {
      console.error(err);
    }
    updateNavigator();
  });
}

/** Click inside alert block in editor: sync tool instance */
function showAlertToolProperties(alertInst) {
  const container = document.getElementById('properties-content');
  container.innerHTML =
    '<div class="space-y-3">' +
    '<div><label class="label"><span class="label-text text-xs">Alert Type</span></label>' +
    '<select id="alert-type-select" class="select select-bordered select-sm w-full">' +
    '<option value="info"' + (alertInst.data.type === 'info' ? ' selected' : '') + '>\u2139\uFE0F Info</option>' +
    '<option value="warning"' + (alertInst.data.type === 'warning' ? ' selected' : '') + '>\u26A0\uFE0F Warning</option>' +
    '<option value="success"' + (alertInst.data.type === 'success' ? ' selected' : '') + '>\u2705 Success</option>' +
    '<option value="error"' + (alertInst.data.type === 'error' ? ' selected' : '') + '>\u274C Error</option>' +
    '</select></div>' +
    '<div><label class="label"><span class="label-text text-xs">Message</span></label>' +
    '<textarea id="alert-msg-input" class="textarea textarea-bordered textarea-sm w-full" rows="3"></textarea></div></div>';
  document.getElementById('alert-msg-input').value = alertInst.data.text != null ? String(alertInst.data.text) : '';

  document.getElementById('alert-type-select').addEventListener('change', (e) => {
    alertInst.setType(e.target.value);
    updateNavigator();
  });
  document.getElementById('alert-msg-input').addEventListener('input', (e) => {
    alertInst.data.text = e.target.value;
    if (alertInst.span) alertInst.span.textContent = e.target.value;
    updateNavigator();
  });
}

// ==========================================
// Save
// ==========================================
async function savePost() {
  const title = document.getElementById('post-title').value.trim();
  const slug = document.getElementById('post-slug').value.trim();

  if (!title) { alert('Title is required'); return; }
  if (!slug)  { alert('Slug is required'); return; }

  let data;
  try { data = await editor.save(); } catch(e) { alert('Editor error: ' + e.message); return; }

  if (!data.blocks.length) { alert('Write some content first'); return; }

  document.getElementById('hidden-title').value = title;
  document.getElementById('hidden-slug').value = slug;
  document.getElementById('hidden-description').value = document.getElementById('post-description').value.trim();
  document.getElementById('hidden-content').value = JSON.stringify(data);
  document.getElementById('hidden-published').value = document.getElementById('post-published').checked ? '1' : '0';

  document.getElementById('save-form').submit();
}

// ==========================================
// Preview (sunucu = kay\u0131t ile ayn\u0131 renderEditorJSToHTML)
// ==========================================
function escapePreviewTitle(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

async function openPreview() {
  let data;
  try { data = await editor.save(); } catch { return; }
  const titleRaw = document.getElementById('post-title').value || 'Untitled';
  const title = escapePreviewTitle(titleRaw);
  try {
    const res = await fetch('/api/preview-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      alert('Preview failed: ' + res.status);
      return;
    }
    const payload = await res.json();
    const html = payload.html || '';
    const win = window.open('', '_blank');
    win.document.write(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Preview: ' +
        title +
        '</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#1a1a1a;line-height:1.7}h1,h2,h3,h4{margin-top:1.5em;margin-bottom:0.5em}p{margin:0.75em 0}ul,ol{padding-left:1.5em}li{margin:0.25em 0}a{color:#2563eb}code{background:#f3f4f6;padding:0.2em 0.4em;border-radius:3px;font-size:0.9em}s,.cdx-strikethrough{text-decoration:line-through}</style></head><body><h1>' +
        title +
        '</h1>' +
        html +
        '</body></html>'
    );
    win.document.close();
  } catch (e) {
    alert('Preview failed: ' + (e && e.message ? e.message : String(e)));
  }
}
<\/script> </body> </html>`], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Post - Dashboard</title><style>\n    .editor-grid { display: grid; grid-template-columns: 300px 1fr; height: 100vh; }\n    .sidebar { background: #f8fafc; border-right: 1px solid #e2e8f0; overflow-y: auto; }\n    .editor-main { overflow-y: auto; }\n    .nav-item { cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }\n    .nav-item:hover { background: #e2e8f0; }\n    .nav-item.active { background: #dbeafe; color: #1d4ed8; }\n    .ce-block--focused { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 4px; }\n    #editorjs { min-height: 400px; }\n    .codex-editor__redactor { padding-bottom: 200px !important; }\n  </style>', '</head> <body class="bg-gray-50" data-theme="corporate"> ', ` <form method="POST" id="save-form"> <input type="hidden" name="content" id="hidden-content"> <input type="hidden" name="title" id="hidden-title"> <input type="hidden" name="slug" id="hidden-slug"> <input type="hidden" name="description" id="hidden-description"> <input type="hidden" name="published" id="hidden-published" value="0"> </form> <div class="editor-grid"> <!-- SIDEBAR --> <aside class="sidebar flex flex-col"> <div class="p-4 border-b border-gray-200"> <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Posts</a> </div> <!-- Navigator --> <div class="p-4 flex-1"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Blocks</h3> <div id="block-list" class="space-y-1"> <div class="text-sm text-gray-400 italic">Start writing...</div> </div> <p class="text-xs text-gray-400 mt-3 leading-relaxed">Add blocks with the <strong>+</strong> in the editor.</p> </div> <!-- Properties --> <div class="border-t border-gray-200 p-4"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Properties</h3> <div id="properties-content"> <p class="text-sm text-gray-400 italic">Select a block</p> </div> </div> </aside> <!-- MAIN PANEL --> <main class="editor-main"> <!-- Navbar --> <div class="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-3"> <div class="max-w-3xl mx-auto flex items-center gap-3"> <input id="post-title" type="text" placeholder="Post title..." class="input input-bordered input-sm flex-1 font-semibold text-lg"> <input id="post-slug" type="text" placeholder="slug" class="input input-bordered input-sm w-40 text-xs font-mono"> <label class="flex items-center gap-1.5 text-sm cursor-pointer"> <input type="checkbox" id="post-published" class="checkbox checkbox-sm checkbox-primary"> <span>Publish</span> </label> <button id="preview-btn" class="btn btn-ghost btn-sm">Preview</button> <button id="save-btn" class="btn btn-primary btn-sm">Save</button> </div> <div class="max-w-3xl mx-auto mt-2"> <input id="post-description" type="text" placeholder="Short description (optional)" class="input input-bordered input-xs w-full"> </div> </div> <!-- Editor --> <div class="max-w-3xl mx-auto px-6 py-8"> <div id="editorjs"></div> </div> </main> </div> <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.30.6/dist/editorjs.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/paragraph@2.11.7/dist/paragraph.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/nested-list@1.4.3/dist/nested-list.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@sotaproject/strikethrough@1.0.1/dist/bundle.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/header@2.8.8/dist/header.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@2.6.0/dist/quote.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/code@2.9.0/dist/code.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@1.4.2/dist/delimiter.umd.js"><\/script> <script src="https://cdn.jsdelivr.net/npm/@editorjs/image@2.9.0/dist/image.umd.js"><\/script> <script src="/dashboard/alert-block.js"><\/script> <script>
// ==========================================
// State (AlertBlock: /dashboard/alert-block.js \u2192 SnappostAlertBlock)
// ==========================================
let editor;
let activeBlockIndex = null;
let navigatorDebounce = null;
let editorBootStarted = false;

window.addEventListener('pageshow', (e) => {
  if (e.persisted) location.reload();
});

// ==========================================
// Editor.js Init
// ==========================================
function boot() {
  const StrikethroughTool = window.Strikethrough && (window.Strikethrough.default || window.Strikethrough);
  if (
    typeof EditorJS === 'undefined' ||
    typeof Paragraph === 'undefined' ||
    typeof NestedList === 'undefined' ||
    typeof Header === 'undefined' ||
    typeof Quote === 'undefined' ||
    typeof CodeTool === 'undefined' ||
    typeof Delimiter === 'undefined' ||
    typeof ImageTool === 'undefined' ||
    typeof window.SnappostAlertBlock === 'undefined'
  ) {
    setTimeout(boot, 50);
    return;
  }
  if (editorBootStarted) return;
  editorBootStarted = true;

  const inlineToolbar = ['bold', 'italic', 'link'];
  if (StrikethroughTool) inlineToolbar.push('strikethrough');

  const tools = {
    paragraph: {
      class: Paragraph,
      inlineToolbar,
      config: { placeholder: 'Paragraph \u2014 bold, italic, link from toolbar' },
    },
    header: {
      class: Header,
      inlineToolbar,
      config: { placeholder: 'Heading', levels: [1, 2, 3, 4], defaultLevel: 2 },
    },
    list: {
      class: NestedList,
      inlineToolbar,
      config: { defaultStyle: 'unordered' },
    },
    quote: { class: Quote, inlineToolbar },
    code: { class: CodeTool },
    delimiter: { class: Delimiter },
    image: {
      class: ImageTool,
      config: {
        /** Varsay\u0131lan ajax bazen cookie g\xF6ndermez; giri\u015Fli dashboard i\xE7in same-origin fetch */
        uploader: {
          uploadByFile(file) {
            const body = new FormData();
            body.append('file', file, file.name);
            return fetch('/api/upload-media', {
              method: 'POST',
              body,
              credentials: 'same-origin',
            }).then(async (res) => {
              const data = await res.json().catch(() => ({}));
              if (!res.ok || data.success !== 1 || !data.file?.url) {
                throw new Error(data.error || \\\`Upload failed (\\\${res.status})\\\`);
              }
              return data;
            });
          },
          uploadByUrl() {
            return Promise.reject(new Error('URL ile g\xF6rsel ekleme hen\xFCz kapal\u0131'));
          },
        },
      },
    },
    alert: { class: window.SnappostAlertBlock },
  };
  if (StrikethroughTool) {
    tools.strikethrough = { class: StrikethroughTool };
  }

  editor = new EditorJS({
    holder: 'editorjs',
    inlineToolbar,
    tools,
    placeholder: 'Start writing your post...',
    autofocus: true,
    onChange: () => {
      clearTimeout(navigatorDebounce);
      navigatorDebounce = setTimeout(updateNavigator, 150);
    },
  });

  document.getElementById('save-btn').addEventListener('click', savePost);
  document.getElementById('preview-btn').addEventListener('click', openPreview);

  document.getElementById('post-title').addEventListener('input', (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    document.getElementById('post-slug').value = slug;
  });

  document.addEventListener('alert-selected', (e) => {
    showAlertToolProperties(e.detail);
  });
}
document.addEventListener('DOMContentLoaded', boot);

// ==========================================
// Navigator
// ==========================================
const ICONS = { header: '\u{1F4F0}', paragraph: '\u{1F4DD}', list: '\u{1F4CB}', alert: '\u26A0\uFE0F', quote: '\u{1F4AC}', code: '\u{1F4BB}', delimiter: '\u2796', image: '\u{1F5BC}\uFE0F' };

function getBlockLabel(block) {
  switch (block.type) {
    case 'header':    return block.data.text || 'Empty header \u2014 click to edit';
    case 'paragraph': { const t = (block.data.text || '').replace(/<[^>]*>/g, ''); return (t.length > 0 ? t.substring(0, 30) + (t.length > 30 ? '\u2026' : '') : 'Empty paragraph \u2014 click to edit'); }
    case 'list':      return 'List (' + (block.data.items?.length || 0) + ' items)';
    case 'alert':     return 'Alert: ' + (block.data.type || 'info');
    case 'quote':     return (block.data.text || '').replace(/<[^>]*>/g, '').substring(0, 28) || 'Quote \u2014 click to edit';
    case 'code':      return 'Code' + ((block.data.code || '').length ? ' (' + Math.min((block.data.code || '').length, 999) + ' chars)' : '');
    case 'delimiter': return 'Divider';
    case 'image':     return 'Image';
    default:          return block.type;
  }
}

async function updateNavigator() {
  if (!editor || !editor.save) return;
  let data;
  try { data = await editor.save(); } catch { return; }

  const list = document.getElementById('block-list');
  list.innerHTML = '';

  if (data.blocks.length === 0) {
    list.innerHTML = '<div class="text-sm text-gray-400 italic">Start writing...</div>';
    return;
  }

  data.blocks.forEach((block, i) => {
    const div = document.createElement('div');
    const label = getBlockLabel(block);
    const isEmpty = label.includes('Empty') || label.includes('click to edit');
    div.className = 'nav-item' + (activeBlockIndex === i ? ' active' : '');
    div.innerHTML = '<span>' + (ICONS[block.type] || '\u{1F4C4}') + '</span><span class="truncate' + (isEmpty ? ' text-gray-400 italic' : '') + '">' + label + '</span>';
    div.addEventListener('click', () => selectBlock(i));
    list.appendChild(div);
  });
}

function selectBlock(index) {
  activeBlockIndex = index;
  updateNavigator();

  const blocks = document.querySelectorAll('.ce-block');
  if (blocks[index]) {
    blocks[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    blocks[index].querySelector('.ce-block__content')?.click();
    blocks[index].querySelector('[contenteditable]')?.focus();
  }

  showPropertiesForIndex(index);
}

// ==========================================
// Properties Panel
// ==========================================
async function showPropertiesForIndex(index) {
  let data;
  try { data = await editor.save(); } catch { return; }
  const block = data.blocks[index];
  if (!block) return;

  if (block.type === 'alert' && block.id) {
    mountAlertPropertiesByBlockId(block.id, block.data || {});
    return;
  }
  document.getElementById('properties-content').innerHTML =
    '<p class="text-sm text-gray-400 italic">Edit directly in the editor</p>';
}

/** Sidebar: uses Editor.js block id + blocks.update */
function mountAlertPropertiesByBlockId(blockId, data) {
  const type = data.type || 'info';
  const text = data.text != null ? String(data.text) : '';
  const container = document.getElementById('properties-content');
  container.innerHTML =
    '<div class="space-y-3">' +
    '<div><label class="label"><span class="label-text text-xs">Alert Type</span></label>' +
    '<select id="alert-type-select" class="select select-bordered select-sm w-full">' +
    '<option value="info"' + (type === 'info' ? ' selected' : '') + '>\u2139\uFE0F Info</option>' +
    '<option value="warning"' + (type === 'warning' ? ' selected' : '') + '>\u26A0\uFE0F Warning</option>' +
    '<option value="success"' + (type === 'success' ? ' selected' : '') + '>\u2705 Success</option>' +
    '<option value="error"' + (type === 'error' ? ' selected' : '') + '>\u274C Error</option>' +
    '</select></div>' +
    '<div><label class="label"><span class="label-text text-xs">Message</span></label>' +
    '<textarea id="alert-msg-input" class="textarea textarea-bordered textarea-sm w-full" rows="3"></textarea></div></div>';
  document.getElementById('alert-msg-input').value = text;

  document.getElementById('alert-type-select').addEventListener('change', async (e) => {
    const msg = document.getElementById('alert-msg-input').value;
    try {
      await editor.blocks.update(blockId, { text: msg, type: e.target.value });
    } catch (err) {
      console.error(err);
    }
    updateNavigator();
  });
  document.getElementById('alert-msg-input').addEventListener('input', async (e) => {
    const t = document.getElementById('alert-type-select').value;
    try {
      await editor.blocks.update(blockId, { text: e.target.value, type: t });
    } catch (err) {
      console.error(err);
    }
    updateNavigator();
  });
}

/** Click inside alert block in editor: sync tool instance */
function showAlertToolProperties(alertInst) {
  const container = document.getElementById('properties-content');
  container.innerHTML =
    '<div class="space-y-3">' +
    '<div><label class="label"><span class="label-text text-xs">Alert Type</span></label>' +
    '<select id="alert-type-select" class="select select-bordered select-sm w-full">' +
    '<option value="info"' + (alertInst.data.type === 'info' ? ' selected' : '') + '>\u2139\uFE0F Info</option>' +
    '<option value="warning"' + (alertInst.data.type === 'warning' ? ' selected' : '') + '>\u26A0\uFE0F Warning</option>' +
    '<option value="success"' + (alertInst.data.type === 'success' ? ' selected' : '') + '>\u2705 Success</option>' +
    '<option value="error"' + (alertInst.data.type === 'error' ? ' selected' : '') + '>\u274C Error</option>' +
    '</select></div>' +
    '<div><label class="label"><span class="label-text text-xs">Message</span></label>' +
    '<textarea id="alert-msg-input" class="textarea textarea-bordered textarea-sm w-full" rows="3"></textarea></div></div>';
  document.getElementById('alert-msg-input').value = alertInst.data.text != null ? String(alertInst.data.text) : '';

  document.getElementById('alert-type-select').addEventListener('change', (e) => {
    alertInst.setType(e.target.value);
    updateNavigator();
  });
  document.getElementById('alert-msg-input').addEventListener('input', (e) => {
    alertInst.data.text = e.target.value;
    if (alertInst.span) alertInst.span.textContent = e.target.value;
    updateNavigator();
  });
}

// ==========================================
// Save
// ==========================================
async function savePost() {
  const title = document.getElementById('post-title').value.trim();
  const slug = document.getElementById('post-slug').value.trim();

  if (!title) { alert('Title is required'); return; }
  if (!slug)  { alert('Slug is required'); return; }

  let data;
  try { data = await editor.save(); } catch(e) { alert('Editor error: ' + e.message); return; }

  if (!data.blocks.length) { alert('Write some content first'); return; }

  document.getElementById('hidden-title').value = title;
  document.getElementById('hidden-slug').value = slug;
  document.getElementById('hidden-description').value = document.getElementById('post-description').value.trim();
  document.getElementById('hidden-content').value = JSON.stringify(data);
  document.getElementById('hidden-published').value = document.getElementById('post-published').checked ? '1' : '0';

  document.getElementById('save-form').submit();
}

// ==========================================
// Preview (sunucu = kay\u0131t ile ayn\u0131 renderEditorJSToHTML)
// ==========================================
function escapePreviewTitle(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

async function openPreview() {
  let data;
  try { data = await editor.save(); } catch { return; }
  const titleRaw = document.getElementById('post-title').value || 'Untitled';
  const title = escapePreviewTitle(titleRaw);
  try {
    const res = await fetch('/api/preview-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      alert('Preview failed: ' + res.status);
      return;
    }
    const payload = await res.json();
    const html = payload.html || '';
    const win = window.open('', '_blank');
    win.document.write(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Preview: ' +
        title +
        '</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#1a1a1a;line-height:1.7}h1,h2,h3,h4{margin-top:1.5em;margin-bottom:0.5em}p{margin:0.75em 0}ul,ol{padding-left:1.5em}li{margin:0.25em 0}a{color:#2563eb}code{background:#f3f4f6;padding:0.2em 0.4em;border-radius:3px;font-size:0.9em}s,.cdx-strikethrough{text-decoration:line-through}</style></head><body><h1>' +
        title +
        '</h1>' +
        html +
        '</body></html>'
    );
    win.document.close();
  } catch (e) {
    alert('Preview failed: ' + (e && e.message ? e.message : String(e)));
  }
}
<\/script> </body> </html>`])), renderHead(), error && renderTemplate`<div class="fixed top-4 right-4 z-50 bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow border border-red-200 text-sm max-w-sm"> ${error} </div>`);
}, "/home/aurora/snappost/templates/dashboard/src/pages/new.astro", void 0);

const $$file = "/home/aurora/snappost/templates/dashboard/src/pages/new.astro";
const $$url = "/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
