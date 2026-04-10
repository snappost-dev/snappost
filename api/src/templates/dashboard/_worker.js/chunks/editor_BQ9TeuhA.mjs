globalThis.process ??= {}; globalThis.process.env ??= {};
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function renderEditorJSToHTML(json) {
  if (!json || !json.blocks) return "";
  return json.blocks.map((block) => {
    switch (block.type) {
      case "header":
        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      case "paragraph":
        return `<p>${block.data.text}</p>`;
      case "list": {
        const tag = block.data.style === "ordered" ? "ol" : "ul";
        const items = block.data.items.map((i) => `<li>${i}</li>`).join("");
        return `<${tag}>${items}</${tag}>`;
      }
      case "alert": {
        const cls = {
          info: "background:#dbeafe;border-left:4px solid #3b82f6",
          warning: "background:#fef3c7;border-left:4px solid #f59e0b",
          success: "background:#d1fae5;border-left:4px solid #10b981",
          error: "background:#fee2e2;border-left:4px solid #ef4444"
        };
        return `<div style="${cls[block.data.type] || cls.info};padding:1rem;margin:1rem 0;border-radius:0.5rem">${block.data.text}</div>`;
      }
      case "quote":
        return `<blockquote style="border-left:4px solid #cbd5e1;padding:0.75rem 1rem;margin:1rem 0;color:#475569;font-style:italic">${escapeHtml(block.data.text || "")}${block.data.caption ? `<cite style="display:block;font-size:0.875rem;margin-top:0.5rem">— ${escapeHtml(block.data.caption)}</cite>` : ""}</blockquote>`;
      case "code":
        return `<pre style="background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-family:monospace;font-size:0.875rem;margin:1rem 0"><code>${escapeHtml(
          block.data.code || ""
        )}</code></pre>`;
      case "delimiter":
        return `<hr style="border:none;border-top:2px solid #e2e8f0;margin:2rem 0" />`;
      case "image": {
        const url = String(block.data?.file?.url ?? block.data?.url ?? "").trim();
        const caption = String(block.data?.caption ?? "").trim();
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

export { renderEditorJSToHTML as r };
