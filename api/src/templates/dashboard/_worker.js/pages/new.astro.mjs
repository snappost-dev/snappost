globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, r as renderTemplate, b as renderHead, e as createAstro } from '../chunks/astro/server_CZTmva32.mjs';
import { r as renderEditorJSToHTML } from '../chunks/editor_D5VKCT9K.mjs';
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
        await Astro2.locals.runtime.env.DB.prepare("INSERT INTO posts (slug, title, description, content, content_html, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(slug, title, description, contentRaw, content_html, published, now, now).run();
        return Astro2.redirect("/");
      }
    } catch (e) {
      error = "Error creating post: " + e.message;
    }
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Post - Dashboard</title><link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.css" rel="stylesheet"><script src="https://cdn.tailwindcss.com"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.30.6/dist/editorjs.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/header@2.8.8/dist/header.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/list@1.9.0/dist/list.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@2.6.0/dist/quote.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/code@2.9.0/dist/code.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@1.4.2/dist/delimiter.umd.js"><\/script><script src="/dashboard/alert-block.js"><\/script><style>\n    .editor-grid { display: grid; grid-template-columns: 300px 1fr; height: 100vh; }\n    .sidebar { background: #f8fafc; border-right: 1px solid #e2e8f0; overflow-y: auto; }\n    .editor-main { overflow-y: auto; }\n    .nav-item { cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }\n    .nav-item:hover { background: #e2e8f0; }\n    .nav-item.active { background: #dbeafe; color: #1d4ed8; }\n    .ce-block--focused { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 4px; }\n    #editorjs { min-height: 400px; }\n    .codex-editor__redactor { padding-bottom: 200px !important; }\n  </style>', '</head> <body class="bg-gray-50" data-theme="corporate"> ', ` <form method="POST" id="save-form"> <input type="hidden" name="content" id="hidden-content"> <input type="hidden" name="title" id="hidden-title"> <input type="hidden" name="slug" id="hidden-slug"> <input type="hidden" name="description" id="hidden-description"> <input type="hidden" name="published" id="hidden-published" value="0"> </form> <div class="editor-grid"> <!-- SIDEBAR --> <aside class="sidebar flex flex-col"> <div class="p-4 border-b border-gray-200"> <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Posts</a> </div> <!-- Navigator --> <div class="p-4 flex-1"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Blocks</h3> <div id="block-list" class="space-y-1"> <div class="text-sm text-gray-400 italic">Start writing...</div> </div> <button id="add-block-btn" class="btn btn-ghost btn-sm w-full mt-3 text-gray-500">+ Add Block</button> </div> <!-- Properties --> <div class="border-t border-gray-200 p-4"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Properties</h3> <div id="properties-content"> <p class="text-sm text-gray-400 italic">Select a block</p> </div> </div> </aside> <!-- MAIN PANEL --> <main class="editor-main"> <!-- Navbar --> <div class="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-3"> <div class="max-w-3xl mx-auto flex items-center gap-3"> <input id="post-title" type="text" placeholder="Post title..." class="input input-bordered input-sm flex-1 font-semibold text-lg"> <input id="post-slug" type="text" placeholder="slug" class="input input-bordered input-sm w-40 text-xs font-mono"> <label class="flex items-center gap-1.5 text-sm cursor-pointer"> <input type="checkbox" id="post-published" class="checkbox checkbox-sm checkbox-primary"> <span>Publish</span> </label> <button id="preview-btn" class="btn btn-ghost btn-sm">Preview</button> <button id="save-btn" class="btn btn-primary btn-sm">Save</button> </div> <div class="max-w-3xl mx-auto mt-2"> <input id="post-description" type="text" placeholder="Short description (optional)" class="input input-bordered input-xs w-full"> </div> </div> <!-- Editor --> <div class="max-w-3xl mx-auto px-6 py-8"> <div id="editorjs"></div> </div> </main> </div> <!-- Add Block Modal --> <dialog id="add-block-modal" class="modal"> <div class="modal-box max-w-sm"> <h3 class="font-bold text-lg mb-4">Add Block</h3> <div class="grid grid-cols-2 gap-2"> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('paragraph')">\u{1F4DD} Paragraph</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('header')">\u{1F4F0} Header</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('list')">\u{1F4CB} List</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('alert')">\u26A0\uFE0F Alert</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('quote')">\u{1F4AC} Quote</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('code')">\u{1F4BB} Code</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('delimiter')">\u2796 Divider</button> </div> <div class="modal-action"> <form method="dialog"><button class="btn btn-sm">Close</button></form> </div> </div> <form method="dialog" class="modal-backdrop"><button>close</button></form> </dialog> <script>
// ==========================================
// State (AlertBlock: /dashboard/alert-block.js \u2192 SnappostAlertBlock)
// ==========================================
let editor;
let activeBlockIndex = null;
let activeAlertInstance = null;
let navigatorDebounce = null;

// ==========================================
// Editor.js Init
// ==========================================
function boot() {
  if (
    typeof EditorJS === 'undefined' ||
    typeof Header === 'undefined' ||
    typeof List === 'undefined' ||
    typeof Quote === 'undefined' ||
    typeof CodeTool === 'undefined' ||
    typeof Delimiter === 'undefined' ||
    typeof window.SnappostAlertBlock === 'undefined'
  ) {
    setTimeout(boot, 50);
    return;
  }
  editor = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: { class: Header, inlineToolbar: true, config: { placeholder: 'Heading', levels: [1,2,3,4], defaultLevel: 2 } },
      list:   { class: List, inlineToolbar: true },
      quote:  { class: Quote, inlineToolbar: true },
      code:   { class: CodeTool },
      delimiter: { class: Delimiter },
      alert:  { class: window.SnappostAlertBlock },
    },
    placeholder: 'Start writing your post...',
    autofocus: true,
    onChange: () => {
      clearTimeout(navigatorDebounce);
      navigatorDebounce = setTimeout(updateNavigator, 300);
    },
  });

  document.getElementById('add-block-btn').addEventListener('click', () => {
    document.getElementById('add-block-modal').showModal();
  });

  document.getElementById('save-btn').addEventListener('click', savePost);
  document.getElementById('preview-btn').addEventListener('click', openPreview);

  document.getElementById('post-title').addEventListener('input', (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    document.getElementById('post-slug').value = slug;
  });

  document.addEventListener('alert-selected', (e) => {
    activeAlertInstance = e.detail;
    showAlertProperties(e.detail);
  });
}
document.addEventListener('DOMContentLoaded', boot);

// ==========================================
// Navigator
// ==========================================
const ICONS = { header: '\u{1F4F0}', paragraph: '\u{1F4DD}', list: '\u{1F4CB}', alert: '\u26A0\uFE0F', quote: '\u{1F4AC}', code: '\u{1F4BB}', delimiter: '\u2796' };

function getBlockLabel(block) {
  switch (block.type) {
    case 'header':    return block.data.text || 'Empty header \u2014 click to edit';
    case 'paragraph': { const t = (block.data.text || '').replace(/<[^>]*>/g, ''); return (t.length > 0 ? t.substring(0, 30) + (t.length > 30 ? '\u2026' : '') : 'Empty paragraph \u2014 click to edit'); }
    case 'list':      return 'List (' + (block.data.items?.length || 0) + ' items)';
    case 'alert':     return 'Alert: ' + (block.data.type || 'info');
    case 'quote':     return (block.data.text || '').replace(/<[^>]*>/g, '').substring(0, 28) || 'Quote \u2014 click to edit';
    case 'code':      return 'Code' + ((block.data.code || '').length ? ' (' + Math.min((block.data.code || '').length, 999) + ' chars)' : '');
    case 'delimiter': return 'Divider';
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

  if (block.type === 'alert' && activeAlertInstance) {
    showAlertProperties(activeAlertInstance);
  } else {
    document.getElementById('properties-content').innerHTML =
      '<p class="text-sm text-gray-400 italic">Edit directly in the editor</p>';
  }
}

function showAlertProperties(alertInst) {
  const container = document.getElementById('properties-content');
  container.innerHTML = \`
    <div class="space-y-3">
      <div>
        <label class="label"><span class="label-text text-xs">Alert Type</span></label>
        <select id="alert-type-select" class="select select-bordered select-sm w-full">
          <option value="info" \${alertInst.data.type === 'info' ? 'selected' : ''}>\u2139\uFE0F Info</option>
          <option value="warning" \${alertInst.data.type === 'warning' ? 'selected' : ''}>\u26A0\uFE0F Warning</option>
          <option value="success" \${alertInst.data.type === 'success' ? 'selected' : ''}>\u2705 Success</option>
          <option value="error" \${alertInst.data.type === 'error' ? 'selected' : ''}>\u274C Error</option>
        </select>
      </div>
      <div>
        <label class="label"><span class="label-text text-xs">Message</span></label>
        <textarea id="alert-msg-input" class="textarea textarea-bordered textarea-sm w-full" rows="3">\${alertInst.data.text}</textarea>
      </div>
    </div>\`;

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
// Add Block
// ==========================================
async function insertBlock(type) {
  document.getElementById('add-block-modal').close();
  const atIndex = editor.blocks.getBlocksCount();
  try {
    await editor.blocks.insert(type, undefined, undefined, atIndex, true);
  } catch (e) {
    console.error(e);
    return;
  }

  setTimeout(() => {
    const newIndex = editor.blocks.getBlocksCount() - 1;
    const blocks = document.querySelectorAll('.ce-block');
    const newBlock = blocks[newIndex];
    if (newBlock) {
      newBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      newBlock.style.outline = '2px solid #3b82f6';
      newBlock.style.outlineOffset = '2px';
      newBlock.style.borderRadius = '4px';
      setTimeout(() => { newBlock.style.outline = ''; newBlock.style.outlineOffset = ''; }, 1500);
      const editable = newBlock.querySelector('[contenteditable]');
      if (editable) editable.focus();
    }
    activeBlockIndex = newIndex;
    updateNavigator();
  }, 300);
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
// Preview
// ==========================================
async function openPreview() {
  let data;
  try { data = await editor.save(); } catch { return; }
  const title = document.getElementById('post-title').value || 'Untitled';
  const html = renderPreviewHTML(data);

  const win = window.open('', '_blank');
  win.document.write(\`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Preview: \${title}</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#1a1a1a;line-height:1.7}h1,h2,h3,h4{margin-top:1.5em;margin-bottom:0.5em}p{margin:0.75em 0}ul,ol{padding-left:1.5em}li{margin:0.25em 0}code{background:#f3f4f6;padding:0.2em 0.4em;border-radius:3px;font-size:0.9em}</style></head><body><h1>\${title}</h1>\${html}</body></html>\`);
  win.document.close();
}

function escapePrev(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPreviewHTML(content) {
  return content.blocks.map(block => {
    switch (block.type) {
      case 'header':    return '<h' + block.data.level + '>' + block.data.text + '</h' + block.data.level + '>';
      case 'paragraph': return '<p>' + block.data.text + '</p>';
      case 'list': {
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return '<' + tag + '>' + block.data.items.map(i => '<li>' + i + '</li>').join('') + '</' + tag + '>';
      }
      case 'alert': {
        const s = { info:'background:#dbeafe;border-left:4px solid #3b82f6', warning:'background:#fef3c7;border-left:4px solid #f59e0b', success:'background:#d1fae5;border-left:4px solid #10b981', error:'background:#fee2e2;border-left:4px solid #ef4444' };
        return '<div style="' + (s[block.data.type]||s.info) + ';padding:1rem;margin:1rem 0;border-radius:0.5rem">' + block.data.text + '</div>';
      }
      case 'quote':
        return '<blockquote style="border-left:4px solid #cbd5e1;padding:0.75rem 1rem;margin:1rem 0;color:#475569;font-style:italic">' + escapePrev(block.data.text) +
          (block.data.caption ? '<cite style="display:block;font-size:0.875rem;margin-top:0.5rem">\u2014 ' + escapePrev(block.data.caption) + '</cite>' : '') + '</blockquote>';
      case 'code':
        return '<pre style="background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-family:monospace;font-size:0.875rem;margin:1rem 0"><code>' + escapePrev(block.data.code) + '</code></pre>';
      case 'delimiter':
        return '<hr style="border:none;border-top:2px solid #e2e8f0;margin:2rem 0" />';
      default: return '';
    }
  }).join('\\n');
}
<\/script> </body> </html>`], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Post - Dashboard</title><link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.css" rel="stylesheet"><script src="https://cdn.tailwindcss.com"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.30.6/dist/editorjs.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/header@2.8.8/dist/header.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/list@1.9.0/dist/list.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@2.6.0/dist/quote.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/code@2.9.0/dist/code.umd.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@1.4.2/dist/delimiter.umd.js"><\/script><script src="/dashboard/alert-block.js"><\/script><style>\n    .editor-grid { display: grid; grid-template-columns: 300px 1fr; height: 100vh; }\n    .sidebar { background: #f8fafc; border-right: 1px solid #e2e8f0; overflow-y: auto; }\n    .editor-main { overflow-y: auto; }\n    .nav-item { cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }\n    .nav-item:hover { background: #e2e8f0; }\n    .nav-item.active { background: #dbeafe; color: #1d4ed8; }\n    .ce-block--focused { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 4px; }\n    #editorjs { min-height: 400px; }\n    .codex-editor__redactor { padding-bottom: 200px !important; }\n  </style>', '</head> <body class="bg-gray-50" data-theme="corporate"> ', ` <form method="POST" id="save-form"> <input type="hidden" name="content" id="hidden-content"> <input type="hidden" name="title" id="hidden-title"> <input type="hidden" name="slug" id="hidden-slug"> <input type="hidden" name="description" id="hidden-description"> <input type="hidden" name="published" id="hidden-published" value="0"> </form> <div class="editor-grid"> <!-- SIDEBAR --> <aside class="sidebar flex flex-col"> <div class="p-4 border-b border-gray-200"> <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Posts</a> </div> <!-- Navigator --> <div class="p-4 flex-1"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Blocks</h3> <div id="block-list" class="space-y-1"> <div class="text-sm text-gray-400 italic">Start writing...</div> </div> <button id="add-block-btn" class="btn btn-ghost btn-sm w-full mt-3 text-gray-500">+ Add Block</button> </div> <!-- Properties --> <div class="border-t border-gray-200 p-4"> <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Properties</h3> <div id="properties-content"> <p class="text-sm text-gray-400 italic">Select a block</p> </div> </div> </aside> <!-- MAIN PANEL --> <main class="editor-main"> <!-- Navbar --> <div class="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-3"> <div class="max-w-3xl mx-auto flex items-center gap-3"> <input id="post-title" type="text" placeholder="Post title..." class="input input-bordered input-sm flex-1 font-semibold text-lg"> <input id="post-slug" type="text" placeholder="slug" class="input input-bordered input-sm w-40 text-xs font-mono"> <label class="flex items-center gap-1.5 text-sm cursor-pointer"> <input type="checkbox" id="post-published" class="checkbox checkbox-sm checkbox-primary"> <span>Publish</span> </label> <button id="preview-btn" class="btn btn-ghost btn-sm">Preview</button> <button id="save-btn" class="btn btn-primary btn-sm">Save</button> </div> <div class="max-w-3xl mx-auto mt-2"> <input id="post-description" type="text" placeholder="Short description (optional)" class="input input-bordered input-xs w-full"> </div> </div> <!-- Editor --> <div class="max-w-3xl mx-auto px-6 py-8"> <div id="editorjs"></div> </div> </main> </div> <!-- Add Block Modal --> <dialog id="add-block-modal" class="modal"> <div class="modal-box max-w-sm"> <h3 class="font-bold text-lg mb-4">Add Block</h3> <div class="grid grid-cols-2 gap-2"> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('paragraph')">\u{1F4DD} Paragraph</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('header')">\u{1F4F0} Header</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('list')">\u{1F4CB} List</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('alert')">\u26A0\uFE0F Alert</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('quote')">\u{1F4AC} Quote</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('code')">\u{1F4BB} Code</button> <button type="button" class="btn btn-ghost justify-start gap-2" onclick="insertBlock('delimiter')">\u2796 Divider</button> </div> <div class="modal-action"> <form method="dialog"><button class="btn btn-sm">Close</button></form> </div> </div> <form method="dialog" class="modal-backdrop"><button>close</button></form> </dialog> <script>
// ==========================================
// State (AlertBlock: /dashboard/alert-block.js \u2192 SnappostAlertBlock)
// ==========================================
let editor;
let activeBlockIndex = null;
let activeAlertInstance = null;
let navigatorDebounce = null;

// ==========================================
// Editor.js Init
// ==========================================
function boot() {
  if (
    typeof EditorJS === 'undefined' ||
    typeof Header === 'undefined' ||
    typeof List === 'undefined' ||
    typeof Quote === 'undefined' ||
    typeof CodeTool === 'undefined' ||
    typeof Delimiter === 'undefined' ||
    typeof window.SnappostAlertBlock === 'undefined'
  ) {
    setTimeout(boot, 50);
    return;
  }
  editor = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: { class: Header, inlineToolbar: true, config: { placeholder: 'Heading', levels: [1,2,3,4], defaultLevel: 2 } },
      list:   { class: List, inlineToolbar: true },
      quote:  { class: Quote, inlineToolbar: true },
      code:   { class: CodeTool },
      delimiter: { class: Delimiter },
      alert:  { class: window.SnappostAlertBlock },
    },
    placeholder: 'Start writing your post...',
    autofocus: true,
    onChange: () => {
      clearTimeout(navigatorDebounce);
      navigatorDebounce = setTimeout(updateNavigator, 300);
    },
  });

  document.getElementById('add-block-btn').addEventListener('click', () => {
    document.getElementById('add-block-modal').showModal();
  });

  document.getElementById('save-btn').addEventListener('click', savePost);
  document.getElementById('preview-btn').addEventListener('click', openPreview);

  document.getElementById('post-title').addEventListener('input', (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    document.getElementById('post-slug').value = slug;
  });

  document.addEventListener('alert-selected', (e) => {
    activeAlertInstance = e.detail;
    showAlertProperties(e.detail);
  });
}
document.addEventListener('DOMContentLoaded', boot);

// ==========================================
// Navigator
// ==========================================
const ICONS = { header: '\u{1F4F0}', paragraph: '\u{1F4DD}', list: '\u{1F4CB}', alert: '\u26A0\uFE0F', quote: '\u{1F4AC}', code: '\u{1F4BB}', delimiter: '\u2796' };

function getBlockLabel(block) {
  switch (block.type) {
    case 'header':    return block.data.text || 'Empty header \u2014 click to edit';
    case 'paragraph': { const t = (block.data.text || '').replace(/<[^>]*>/g, ''); return (t.length > 0 ? t.substring(0, 30) + (t.length > 30 ? '\u2026' : '') : 'Empty paragraph \u2014 click to edit'); }
    case 'list':      return 'List (' + (block.data.items?.length || 0) + ' items)';
    case 'alert':     return 'Alert: ' + (block.data.type || 'info');
    case 'quote':     return (block.data.text || '').replace(/<[^>]*>/g, '').substring(0, 28) || 'Quote \u2014 click to edit';
    case 'code':      return 'Code' + ((block.data.code || '').length ? ' (' + Math.min((block.data.code || '').length, 999) + ' chars)' : '');
    case 'delimiter': return 'Divider';
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

  if (block.type === 'alert' && activeAlertInstance) {
    showAlertProperties(activeAlertInstance);
  } else {
    document.getElementById('properties-content').innerHTML =
      '<p class="text-sm text-gray-400 italic">Edit directly in the editor</p>';
  }
}

function showAlertProperties(alertInst) {
  const container = document.getElementById('properties-content');
  container.innerHTML = \\\`
    <div class="space-y-3">
      <div>
        <label class="label"><span class="label-text text-xs">Alert Type</span></label>
        <select id="alert-type-select" class="select select-bordered select-sm w-full">
          <option value="info" \\\${alertInst.data.type === 'info' ? 'selected' : ''}>\u2139\uFE0F Info</option>
          <option value="warning" \\\${alertInst.data.type === 'warning' ? 'selected' : ''}>\u26A0\uFE0F Warning</option>
          <option value="success" \\\${alertInst.data.type === 'success' ? 'selected' : ''}>\u2705 Success</option>
          <option value="error" \\\${alertInst.data.type === 'error' ? 'selected' : ''}>\u274C Error</option>
        </select>
      </div>
      <div>
        <label class="label"><span class="label-text text-xs">Message</span></label>
        <textarea id="alert-msg-input" class="textarea textarea-bordered textarea-sm w-full" rows="3">\\\${alertInst.data.text}</textarea>
      </div>
    </div>\\\`;

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
// Add Block
// ==========================================
async function insertBlock(type) {
  document.getElementById('add-block-modal').close();
  const atIndex = editor.blocks.getBlocksCount();
  try {
    await editor.blocks.insert(type, undefined, undefined, atIndex, true);
  } catch (e) {
    console.error(e);
    return;
  }

  setTimeout(() => {
    const newIndex = editor.blocks.getBlocksCount() - 1;
    const blocks = document.querySelectorAll('.ce-block');
    const newBlock = blocks[newIndex];
    if (newBlock) {
      newBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      newBlock.style.outline = '2px solid #3b82f6';
      newBlock.style.outlineOffset = '2px';
      newBlock.style.borderRadius = '4px';
      setTimeout(() => { newBlock.style.outline = ''; newBlock.style.outlineOffset = ''; }, 1500);
      const editable = newBlock.querySelector('[contenteditable]');
      if (editable) editable.focus();
    }
    activeBlockIndex = newIndex;
    updateNavigator();
  }, 300);
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
// Preview
// ==========================================
async function openPreview() {
  let data;
  try { data = await editor.save(); } catch { return; }
  const title = document.getElementById('post-title').value || 'Untitled';
  const html = renderPreviewHTML(data);

  const win = window.open('', '_blank');
  win.document.write(\\\`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Preview: \\\${title}</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#1a1a1a;line-height:1.7}h1,h2,h3,h4{margin-top:1.5em;margin-bottom:0.5em}p{margin:0.75em 0}ul,ol{padding-left:1.5em}li{margin:0.25em 0}code{background:#f3f4f6;padding:0.2em 0.4em;border-radius:3px;font-size:0.9em}</style></head><body><h1>\\\${title}</h1>\\\${html}</body></html>\\\`);
  win.document.close();
}

function escapePrev(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPreviewHTML(content) {
  return content.blocks.map(block => {
    switch (block.type) {
      case 'header':    return '<h' + block.data.level + '>' + block.data.text + '</h' + block.data.level + '>';
      case 'paragraph': return '<p>' + block.data.text + '</p>';
      case 'list': {
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return '<' + tag + '>' + block.data.items.map(i => '<li>' + i + '</li>').join('') + '</' + tag + '>';
      }
      case 'alert': {
        const s = { info:'background:#dbeafe;border-left:4px solid #3b82f6', warning:'background:#fef3c7;border-left:4px solid #f59e0b', success:'background:#d1fae5;border-left:4px solid #10b981', error:'background:#fee2e2;border-left:4px solid #ef4444' };
        return '<div style="' + (s[block.data.type]||s.info) + ';padding:1rem;margin:1rem 0;border-radius:0.5rem">' + block.data.text + '</div>';
      }
      case 'quote':
        return '<blockquote style="border-left:4px solid #cbd5e1;padding:0.75rem 1rem;margin:1rem 0;color:#475569;font-style:italic">' + escapePrev(block.data.text) +
          (block.data.caption ? '<cite style="display:block;font-size:0.875rem;margin-top:0.5rem">\u2014 ' + escapePrev(block.data.caption) + '</cite>' : '') + '</blockquote>';
      case 'code':
        return '<pre style="background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-family:monospace;font-size:0.875rem;margin:1rem 0"><code>' + escapePrev(block.data.code) + '</code></pre>';
      case 'delimiter':
        return '<hr style="border:none;border-top:2px solid #e2e8f0;margin:2rem 0" />';
      default: return '';
    }
  }).join('\\\\n');
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
