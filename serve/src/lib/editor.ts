export { renderEditorJSToHTML } from "./editor-html";

type EditorDocument = {
  time?: number;
  version?: string;
  blocks?: unknown[];
};

export function normalizeEditorJsDocument(raw: unknown): EditorDocument {
  const input = (raw ?? {}) as EditorDocument;
  const blocks = Array.isArray(input.blocks) ? input.blocks : [];
  return {
    time: typeof input.time === "number" ? input.time : Date.now(),
    version: typeof input.version === "string" ? input.version : "2.30.0",
    blocks
  };
}
