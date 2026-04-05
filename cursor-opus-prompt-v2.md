# SNAPPOST DASHBOARD - EDITOR.JS IMPLEMENTATION PLAN (V2 - REVISED)

## CONTEXT

Mevcut dashboard basit markdown textarea kullanıyor. Editor.js ile block-based bir editöre geçiyoruz.
Branch: `feature/editorjs-dashboard`

## MEVCUT DURUM

- `new.astro`: Markdown textarea + form POST → D1 (marked ile HTML'e çevir)
- `edit/[id].astro`: Aynı markdown textarea, mevcut post'u düzenle
- `Dashboard.astro`: Layout (header nav + slot)
- `middleware.ts`: Cookie auth check
- DB schema: `posts (content TEXT, content_html TEXT)` — content'te kaynak, content_html'de render
- Shell (blog frontend): `content_html` kolonunu render ediyor

## KRİTİK KARARLAR

### 1. Content format geçişi
- `content` kolonu artık **Editor.js JSON string** tutacak (eskiden markdown)
- `content_html` kolonu **Editor.js JSON'dan render edilmiş HTML** tutacak
- Shell (blog) hiç değişmeyecek — `content_html`'i olduğu gibi render ediyor
- Eski markdown post'lar çalışmaya devam eder (content_html zaten HTML)

### 2. DaisyUI scope'lama
- DaisyUI **sadece** `new.astro` ve `edit/[id].astro` içinde CDN ile yüklenir
- `data-theme="corporate"` sadece editor container `<div>`'ine konur, `<html>`'e DEĞİL
- Diğer sayfalar (index, login, logout) dokunulmaz

### 3. Save flow
- Editor.js JSON → hidden `<input name="content">` içine stringify edilir
- Mevcut form POST pattern'i korunur (Astro SSR)
- Server-side `renderEditorJSToHTML()` fonksiyonu JSON → HTML çevirir
- `marked` import'u kaldırılır, yerine `renderEditorJSToHTML` gelir

### 4. Edit sayfası da güncellenir
- `edit/[id].astro` da aynı Editor.js UI'ını kullanır
- Mevcut post'un `content` JSON'ı Editor.js'e `data` olarak verilir
- Eski markdown content'li post'lar: Editor.js boş açılır, uyarı gösterilir

---

## DOSYA DEĞİŞİKLİKLERİ

| Dosya | İşlem |
|-------|-------|
| `src/pages/new.astro` | **Tamamen yeniden yaz** — Editor.js UI |
| `src/pages/edit/[id].astro` | **Tamamen yeniden yaz** — Editor.js UI (mevcut data ile) |
| `src/layouts/Dashboard.astro` | Dokunma |
| `src/pages/index.astro` | Dokunma |
| `src/pages/login.astro` | Dokunma |
| `src/pages/logout.astro` | Dokunma |
| `src/middleware.ts` | Dokunma |

---

## IMPLEMENTATION ORDER

### STEP 1: `new.astro` — Editor.js ile yeni post oluşturma

**Layout:**
```
┌──────────────┬──────────────────────────────┐
│  SIDEBAR     │  MAIN PANEL                  │
│  (300px)     │  (max-width: 800px centered) │
│              │                              │
│  Navigator   │  Navbar (Title + Buttons)    │
│  Properties  │  Editor.js Container         │
│  Add Block   │                              │
└──────────────┴──────────────────────────────┘
```

**HTML structure:**
- Standalone page (Dashboard layout KULLANILMAZ — kendi full-page layout'u var)
- DaisyUI + Tailwind CDN (sadece bu sayfada)
- `data-theme="corporate"` sadece `.dashboard-container` div'inde
- Tüm JS `<script is:inline>` içinde

**Editor.js tools (CDN):**
- `@editorjs/editorjs` — core
- `@editorjs/header` — başlıklar (h1-h4)
- `@editorjs/paragraph` — paragraf (default)
- `@editorjs/list` — sıralı/sırasız liste
- Custom `AlertBlock` — DaisyUI alert component

**Sidebar — Navigator:**
- `editor.onChange` → block listesini güncelle
- Her block: icon + truncated text (30 char)
- Click → scroll to block + highlight
- Icons: header=📰, paragraph=📝, list=📋, alert=⚠️

**Sidebar — Properties:**
- Active block seçildiğinde gösterilir
- Alert block: type selector (info/warning/success/error) + message textarea
- Diğer block'lar: "Edit directly in the editor" mesajı

**Sidebar — Add Block:**
- DaisyUI modal (2 column grid)
- Options: Paragraph, Header, List, Alert
- Insert → close modal → update navigator

**Navbar:**
- Post title input
- Slug input (auto-generate from title)
- Description input
- Published checkbox
- Preview button → yeni tab'da render
- Save button → form submit

**Save flow:**
1. Client: `editor.save()` → JSON string → hidden input `name="content"`
2. Client: Title, slug, description, published → hidden inputs
3. Client: Form submit (POST)
4. Server: Parse content JSON → `renderEditorJSToHTML(json)` → `content_html`
5. Server: INSERT INTO posts → redirect /

**`renderEditorJSToHTML` fonksiyonu (server-side, frontmatter'da):**
```typescript
function renderEditorJSToHTML(json: any): string {
  return json.blocks.map((block: any) => {
    switch (block.type) {
      case 'header':
        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      case 'paragraph':
        return `<p>${block.data.text}</p>`;
      case 'list':
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items.map((i: string) => `<li>${i}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      case 'alert':
        const cls = { info: 'background:#dbeafe;border-left:4px solid #3b82f6',
                       warning: 'background:#fef3c7;border-left:4px solid #f59e0b',
                       success: 'background:#d1fae5;border-left:4px solid #10b981',
                       error: 'background:#fee2e2;border-left:4px solid #ef4444' };
        return `<div style="${cls[block.data.type] || cls.info};padding:1rem;margin:1rem 0;border-radius:0.5rem">${block.data.text}</div>`;
      default:
        return '';
    }
  }).join('\n');
}
```

Alert HTML'de inline style kullanılıyor (DaisyUI class'ları Shell'de yok, inline style her yerde çalışır).

---

### STEP 2: `edit/[id].astro` — Mevcut post'u Editor.js ile düzenleme

- `new.astro` ile aynı UI (copy-paste + minor changes)
- Farklar:
  - Post DB'den okunur, `content` JSON parse edilir
  - Editor.js `data` parametresi ile initialize edilir
  - Save: UPDATE instead of INSERT
  - Title/slug/description pre-filled
  - Eski markdown post'lar: `content` JSON parse edilemezse uyarı göster

---

### STEP 3: Template rebuild + embed + deploy

```bash
cd ~/snappost/templates/dashboard
npm run build
cp -r dist/* ~/snappost/api/src/templates/dashboard/
cd ~/snappost/api
npm run embed
npm run dev  # local test
wrangler deploy  # production
```

---

## CUSTOM ALERTBLOCK CLASS

```javascript
class AlertBlock {
  static get toolbox() {
    return { title: 'Alert Box', icon: '⚠️' };
  }

  constructor({data}) {
    this.data = {
      text: data.text || 'Alert message here...',
      type: data.type || 'info'
    };
    this.wrapper = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this._updateStyle();

    const span = document.createElement('span');
    span.contentEditable = true;
    span.textContent = this.data.text;
    span.addEventListener('input', () => { this.data.text = span.textContent; });

    this.wrapper.appendChild(span);
    this.wrapper.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('alert-selected', { detail: this }));
    });

    return this.wrapper;
  }

  _updateStyle() {
    const styles = {
      info: 'background:#dbeafe;border-left:4px solid #3b82f6',
      warning: 'background:#fef3c7;border-left:4px solid #f59e0b',
      success: 'background:#d1fae5;border-left:4px solid #10b981',
      error: 'background:#fee2e2;border-left:4px solid #ef4444'
    };
    this.wrapper.setAttribute('style',
      `${styles[this.data.type] || styles.info};padding:1rem;margin:0.5rem 0;border-radius:0.5rem;cursor:text`);
  }

  setType(type) {
    this.data.type = type;
    this._updateStyle();
  }

  save() {
    return { text: this.data.text, type: this.data.type };
  }

  validate(data) {
    return data.text.trim().length > 0;
  }
}
```

---

## SUCCESS CRITERIA

1. ✅ `new.astro`: Sidebar + Editor.js layout render ediyor
2. ✅ Editor.js: Header, Paragraph, List, AlertBlock çalışıyor
3. ✅ Navigator: Block listesi güncelleniyor, click → scroll
4. ✅ Properties: Alert seçilince type/message düzenlenebiliyor
5. ✅ Add Block: Modal açılıyor, block ekleniyor
6. ✅ Save: D1'e kaydediyor (JSON content + rendered HTML)
7. ✅ Preview: Yeni tab'da Shell-style render
8. ✅ `edit/[id].astro`: Mevcut post Editor.js'de açılıyor
9. ✅ Edit save: D1'de güncelleniyor
10. ✅ Shell blog: Yeni post'lar düzgün render ediliyor
11. ✅ Eski sayfalar (index, login) bozulmamış

---

## NOTES

- `is:inline` tüm script tag'larında zorunlu (Astro SSR)
- DaisyUI sadece editor sayfalarında, diğer sayfalara bulaşmaz
- Alert render'da inline style kullan (Shell'de DaisyUI yok)
- Slug auto-generate: title → lowercase → replace spaces with hyphens → remove non-alphanumeric
- Mobile responsive: şimdilik skip (sidebar gizlenebilir ama zorunlu değil)
