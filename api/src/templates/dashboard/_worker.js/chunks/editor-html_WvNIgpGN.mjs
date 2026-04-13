globalThis.process ??= {}; globalThis.process.env ??= {};
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function renderListItems(items, listStyle) {
  if (!Array.isArray(items) || items.length === 0) return "";
  const nestedTag = listStyle === "ordered" ? "ol" : "ul";
  return items.map((item) => {
    if (typeof item === "string") {
      return `<li>${item}</li>`;
    }
    if (item && typeof item === "object" && item !== null) {
      const o = item;
      const content = typeof o.content === "string" ? o.content : "";
      const subItems = Array.isArray(o.items) ? o.items : [];
      const sub = subItems.length > 0 ? `<${nestedTag}>${renderListItems(subItems, listStyle)}</${nestedTag}>` : "";
      return `<li>${content}${sub}</li>`;
    }
    return "";
  }).join("");
}
function renderListBlock(data) {
  const style = data.style === "ordered" ? "ordered" : "unordered";
  const tag = style === "ordered" ? "ol" : "ul";
  const items = Array.isArray(data.items) ? data.items : [];
  return `<${tag}>${renderListItems(items, style)}</${tag}>`;
}
function normalizeListItemsForEditor(items) {
  return items.map((item) => {
    if (typeof item === "string") {
      return { content: item, items: [] };
    }
    if (item && typeof item === "object" && item !== null) {
      const o = item;
      const content = typeof o.content === "string" ? o.content : "";
      const sub = Array.isArray(o.items) ? normalizeListItemsForEditor(o.items) : [];
      return { content, items: sub };
    }
    return { content: "", items: [] };
  });
}
function normalizeEditorJsDocument(json) {
  if (!json || !Array.isArray(json.blocks)) return json;
  return {
    ...json,
    blocks: json.blocks.map((block) => {
      if (!block || typeof block !== "object") return block;
      const b = block;
      if (b.type !== "list" || !b.data || !Array.isArray(b.data.items)) return block;
      return {
        ...b,
        data: {
          ...b.data,
          items: normalizeListItemsForEditor(b.data.items)
        }
      };
    })
  };
}
function renderEditorJSToHTML(json) {
  if (!json || !Array.isArray(json.blocks)) return "";
  return json.blocks.map((block) => {
    if (!block || typeof block !== "object") return "";
    const b = block;
    const type = b.type;
    const data = b.data ?? {};
    switch (type) {
      case "header": {
        const level = Math.min(6, Math.max(1, Number(data.level) || 2));
        const text = typeof data.text === "string" ? data.text : "";
        return `<h${level}>${text}</h${level}>`;
      }
      case "paragraph": {
        const text = typeof data.text === "string" ? data.text : "";
        return `<p>${text}</p>`;
      }
      case "list":
        return renderListBlock(data);
      case "alert": {
        const cls = {
          info: "background:#dbeafe;border-left:4px solid #3b82f6",
          warning: "background:#fef3c7;border-left:4px solid #f59e0b",
          success: "background:#d1fae5;border-left:4px solid #10b981",
          error: "background:#fee2e2;border-left:4px solid #ef4444"
        };
        const t = typeof data.type === "string" ? data.type : "info";
        const body = typeof data.text === "string" ? data.text : "";
        return `<div style="${cls[t] || cls.info};padding:1rem;margin:1rem 0;border-radius:0.5rem">${body}</div>`;
      }
      case "quote": {
        const qText = typeof data.text === "string" ? data.text : "";
        const cap = typeof data.caption === "string" ? data.caption : "";
        return `<blockquote style="border-left:4px solid #cbd5e1;padding:0.75rem 1rem;margin:1rem 0;color:#475569;font-style:italic">${qText}${cap ? `<cite style="display:block;font-size:0.875rem;margin-top:0.5rem;font-style:normal">— ${escapeHtml(cap)}</cite>` : ""}</blockquote>`;
      }
      case "code":
        return `<pre style="background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-family:monospace;font-size:0.875rem;margin:1rem 0"><code>${escapeHtml(
          typeof data.code === "string" ? data.code : ""
        )}</code></pre>`;
      case "delimiter":
        return `<hr style="border:none;border-top:2px solid #e2e8f0;margin:2rem 0" />`;
      case "image": {
        const file = data.file;
        const url = String(file?.url ?? data.url ?? "").trim();
        const caption = String(data.caption ?? "").trim();
        if (!url) return "";
        const alt = escapeHtml(caption);
        const cap = caption ? `<figcaption style="font-size:0.875rem;color:#64748b;margin-top:0.5rem">${escapeHtml(caption)}</figcaption>` : "";
        return `<figure style="margin:1rem 0"><img src="${escapeHtml(url)}" alt="${alt}" loading="lazy" decoding="async" style="max-width:100%;height:auto;display:block" />${cap}</figure>`;
      }
      default:
        return "";
    }
  }).join("\n");
}

export { normalizeEditorJsDocument as n, renderEditorJSToHTML as r };
