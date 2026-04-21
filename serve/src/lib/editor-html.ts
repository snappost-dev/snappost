type EditorBlock = {
  type?: string;
  data?: Record<string, unknown>;
};

type EditorPayload = {
  blocks?: EditorBlock[];
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderEditorJSToHTML(payload: unknown): string {
  const data = payload as EditorPayload;
  const blocks = Array.isArray(data?.blocks) ? data.blocks : [];

  return blocks
    .map((block) => {
      const type = String(block?.type ?? "");
      const blockData = (block?.data ?? {}) as Record<string, unknown>;

      if (type === "header") {
        const level = Number(blockData.level ?? 2);
        const safeLevel = level >= 1 && level <= 6 ? level : 2;
        const text = escapeHtml(String(blockData.text ?? ""));
        return `<h${safeLevel}>${text}</h${safeLevel}>`;
      }

      if (type === "paragraph") {
        const text = escapeHtml(String(blockData.text ?? ""));
        return `<p>${text}</p>`;
      }

      if (type === "image") {
        const file = (blockData.file ?? {}) as Record<string, unknown>;
        const src = String(file.url ?? "");
        if (!src) return "";
        const caption = escapeHtml(String(blockData.caption ?? ""));
        return `<figure><img src="${escapeHtml(src)}" alt="${caption}"><figcaption>${caption}</figcaption></figure>`;
      }

      return "";
    })
    .join("\n");
}
