import { marked } from 'marked';
import { renderEditorJSToHTML } from './editor-html';

/** Shell `main` genişliği `max-w-4xl` (56rem ≈ 896px) ile uyumlu */
const CONTENT_MAX_WIDTH_PX = 896;
const IMG_SIZES_ATTR = `(max-width: ${CONTENT_MAX_WIDTH_PX}px) 100vw, ${CONTENT_MAX_WIDTH_PX}px`;

/**
 * İçerik görselleri: responsive `sizes`, decoding; ilk görsel LCP için `fetchpriority="high"` + `eager`, diğerleri lazy.
 */
export function enhanceArticleImages(html: string): string {
  if (!html) return '';
  let first = true;
  return html.replace(/<img\b([^>]*?)>/gi, (_full, attrs: string) => {
    let a = attrs;
    if (!/\ssizes\s*=/i.test(a)) a += ` sizes="${IMG_SIZES_ATTR}"`;
    if (!/\sdecoding\s*=/i.test(a)) a += ' decoding="async"';

    if (first) {
      first = false;
      if (!/\sfetchpriority\s*=/i.test(a)) a += ' fetchpriority="high"';
      if (/\sloading\s*=\s*["']lazy["']/i.test(a)) {
        a = a.replace(/\sloading\s*=\s*["']lazy["']/i, ' loading="eager"');
      } else if (!/\sloading\s*=/i.test(a)) {
        a += ' loading="eager"';
      }
    } else {
      if (!/\sloading\s*=/i.test(a)) a += ' loading="lazy"';
    }
    return `<img${a}>`;
  });
}

type PostRow = {
  content_html?: string | null;
  content?: string | null;
};

/**
 * Shell yazı gövdesi: önce `content_html`, boşsa Editor.js JSON `content`, değilse markdown.
 */
export function shellPostBodyHtml(post: PostRow): string {
  const ch = (post.content_html || '').trim();
  if (ch) return enhanceArticleImages(ch);

  const raw = post.content || '';
  const t = raw.trim();
  if (!t) return '';

  if (t.startsWith('{')) {
    try {
      const json = JSON.parse(t) as unknown;
      const inner = renderEditorJSToHTML(json);
      return enhanceArticleImages(inner);
    } catch {
      /* markdown’a düş */
    }
  }

  const md = marked.parse(raw, { async: false }) as string;
  return enhanceArticleImages(md);
}
