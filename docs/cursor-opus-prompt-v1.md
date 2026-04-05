# SNAPPOST DASHBOARD EDITOR - COMPLETE IMPLEMENTATION SPEC

## CONTEXT
Implementing a blog post editor for Snappost Dashboard using Editor.js with sidebar navigation and properties panel.

## TARGET FILE
`templates/dashboard/src/pages/new.astro`

## TECH STACK
- Astro 4 (SSR)
- Editor.js (CDN)
- DaisyUI + Tailwind (corporate theme)
- No React/Vue (vanilla JS only)

---

## ARCHITECTURE

### Layout Structure
```
┌──────────────┬──────────────────────────────┐
│  SIDEBAR     │  MAIN PANEL                  │
│  (350px)     │  (max-width: 800px)          │
│              │                              │
│  Navigator   │  Navbar (Title + Buttons)    │
│  Properties  │  Editor.js Container         │
└──────────────┴──────────────────────────────┘
```

### Components
1. **Sidebar** (350px, sticky, overflow-y):
   - Navigator: Block list with icons
   - Properties: Form for active block
   - Add Block button

2. **Main Panel** (centered, max-width 800px):
   - Navbar: Title input + Preview + Save buttons
   - Editor.js container

3. **Mobile**: Sidebar collapses (optional for now)

---

## DETAILED REQUIREMENTS

### 1. HTML STRUCTURE

```astro
<!DOCTYPE html>
<html data-theme="corporate">
<head>
  <title>New Post - Dashboard</title>
  <!-- DaisyUI + Tailwind CDN -->
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.css" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="dashboard-container"> <!-- Grid layout -->
    
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="navigator">
        <h3>📄 Blocks</h3>
        <ul id="block-list" class="menu"></ul>
        <button id="add-block-btn">+ Add Block</button>
      </div>
      
      <div class="properties">
        <h3>⚙️ Properties</h3>
        <div id="properties-content"></div>
      </div>
    </aside>
    
    <!-- MAIN PANEL -->
    <main class="editor-main">
      <nav class="navbar">
        <input id="post-title" placeholder="Post Title..." />
        <button onclick="openPreview()">👁️ Preview</button>
        <button onclick="savePost()">💾 Save</button>
      </nav>
      
      <div id="editorjs"></div>
    </main>
  </div>
  
  <!-- Editor.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/@editorjs/paragraph@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/@editorjs/list@latest"></script>
  
  <!-- Implementation below -->
</body>
</html>
```

### 2. CSS REQUIREMENTS

```css
.dashboard-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 100vh;
}

.sidebar {
  background: hsl(var(--b2));
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid hsl(var(--bc) / 0.1);
}

.editor-main {
  padding: 2rem;
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* DaisyUI classes for rest */
```

### 3. JAVASCRIPT IMPLEMENTATION

#### 3.1 Global Variables
```javascript
let editor;
let activeBlockIndex = null;
```

#### 3.2 Editor.js Initialization
```javascript
function initEditor() {
  editor = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
        config: {
          placeholder: 'Enter a header',
          levels: [1, 2, 3, 4],
          defaultLevel: 2
        }
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true
      },
      list: {
        class: List,
        inlineToolbar: true
      },
      alert: AlertBlock  // Custom block
    },
    onChange: async (api, event) => {
      updateNavigator();
    },
    placeholder: 'Start writing your post...',
    autofocus: true
  });
}
```

#### 3.3 Custom Block: AlertBlock

**Requirements:**
- DaisyUI alert component (alert-info, alert-warning, alert-success, alert-error)
- contenteditable span for text
- Click to select block
- Type and text editable via properties panel

```javascript
class AlertBlock {
  static get toolbox() {
    return {
      title: 'Alert Box',
      icon: '⚠️'
    };
  }
  
  constructor({data, api, readOnly, block}) {
    this.api = api;
    this.data = {
      text: data.text || '',
      type: data.type || 'info' // info, warning, success, error
    };
  }
  
  render() {
    // Return DaisyUI alert div
    // contenteditable span inside
    // alert-{type} class
    // onclick → selectBlock
  }
  
  save(blockContent) {
    // Return {text, type}
  }
  
  validate(savedData) {
    // text.trim().length > 0
  }
}
```

#### 3.4 Navigator

**Requirements:**
- Update on editor.onChange
- Display block list with icons:
  - header: 📰
  - paragraph: 📝
  - list: 📋
  - alert: ⚠️
- Show truncated text (30 chars)
- Click → scroll to block + show properties

```javascript
async function updateNavigator() {
  const data = await editor.save();
  const blockList = document.getElementById('block-list');
  
  // Clear
  blockList.innerHTML = '';
  
  // Generate list items
  data.blocks.forEach((block, index) => {
    const li = createNavigatorItem(block, index);
    blockList.appendChild(li);
  });
}

function createNavigatorItem(block, index) {
  // Create li with icon + label
  // Add click handler: selectBlock(index)
  // Highlight if activeBlockIndex === index
}

function selectBlock(index) {
  activeBlockIndex = index;
  // Scroll to block
  // Show properties
  // Update navigator highlighting
}
```

#### 3.5 Properties Panel

**Requirements:**
- Show form for active block
- Alert block: Type selector + Message textarea
- Other blocks: "Edit in editor" message
- Real-time updates (change type → update DOM, change message → update DOM)

```javascript
async function showProperties(blockIndex) {
  const data = await editor.save();
  const block = data.blocks[blockIndex];
  
  if (block.type === 'alert') {
    // Render type selector + message textarea
    // Add event listeners
  } else {
    // Show "Edit directly in editor"
  }
}

function updateAlertType(newType) {
  // Find alert element in DOM
  // Update classes (alert-info → alert-warning)
}

function updateAlertMessage(newText) {
  // Find span in DOM
  // Update textContent
}
```

#### 3.6 Add Block Menu

**Requirements:**
- DaisyUI modal
- Grid layout (2 columns)
- Block options: Paragraph, Header, List, Alert
- Insert block → close modal → update navigator

```javascript
function showAddBlockMenu() {
  // Create modal HTML (DaisyUI)
  // Append to body
}

function insertBlock(type) {
  editor.blocks.insert(type);
  closeAddBlockMenu();
  updateNavigator();
}
```

#### 3.7 Save & Preview

**Requirements:**
- Save: Get title + content, validate, log (API integration TODO)
- Preview: Open new tab with Shell-style render
- renderEditorJS: Convert JSON to HTML (same as Shell)

```javascript
async function savePost() {
  const title = document.getElementById('post-title').value;
  const content = await editor.save();
  
  if (!title) {
    alert('⚠️ Please enter a title!');
    return;
  }
  
  console.log('Save:', {title, content});
  alert('✅ Saved! (API integration pending)');
}

async function openPreview() {
  const content = await editor.save();
  const html = renderEditorJS(content);
  
  const win = window.open('', 'Preview');
  win.document.write(`
    <!DOCTYPE html>
    <html data-theme="corporate">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.css" rel="stylesheet" />
      </head>
      <body>
        <article class="prose lg:prose-xl max-w-4xl mx-auto p-8">
          ${html}
        </article>
      </body>
    </html>
  `);
}

function renderEditorJS(content) {
  return content.blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      case 'paragraph':
        return `<p>${block.data.text}</p>`;
      case 'list':
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items.map(i => `<li>${i}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      case 'alert':
        const alertTypes = {
          info: 'alert-info',
          warning: 'alert-warning',
          success: 'alert-success',
          error: 'alert-error'
        };
        return `
          <div class="alert ${alertTypes[block.data.type]} my-4">
            <span>${block.data.text}</span>
          </div>
        `;
      default:
        return '';
    }
  }).join('\n');
}
```

---

## BLOCK ICONS & LABELS

```javascript
function getBlockIcon(type) {
  const icons = {
    header: '📰',
    paragraph: '📝',
    list: '📋',
    alert: '⚠️'
  };
  return icons[type] || '📄';
}

function getBlockLabel(block) {
  switch (block.type) {
    case 'header':
      return block.data.text || 'Header';
    case 'paragraph':
      const text = block.data.text || 'Paragraph';
      return text.substring(0, 30) + (text.length > 30 ? '...' : '');
    case 'list':
      return `List (${block.data.items.length} items)`;
    case 'alert':
      return `Alert: ${block.data.type}`;
    default:
      return block.type;
  }
}
```

---

## DAISYUI CLASSES TO USE

- **Layout**: `grid`, `menu`, `navbar`, `prose`
- **Forms**: `form-control`, `label`, `select`, `textarea`, `input`
- **Buttons**: `btn`, `btn-primary`, `btn-ghost`, `btn-sm`
- **Alerts**: `alert`, `alert-info`, `alert-warning`, `alert-success`, `alert-error`
- **Modal**: `modal`, `modal-box`, `modal-open`

---

## INITIALIZATION

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  setupAddBlockButton();
});

function setupAddBlockButton() {
  document.getElementById('add-block-btn').addEventListener('click', () => {
    showAddBlockMenu();
  });
}
```

---

## SUCCESS CRITERIA

1. ✅ Layout renders (sidebar + main panel)
2. ✅ Editor.js loads with Header, Paragraph, List
3. ✅ AlertBlock works (DaisyUI styled)
4. ✅ Navigator updates on change
5. ✅ Click navigator item → scroll to block
6. ✅ Click alert → properties panel shows
7. ✅ Change type → alert color changes
8. ✅ Change message → alert text updates
9. ✅ Add Block modal works
10. ✅ Preview opens with Shell-style render
11. ✅ Save validates title

---

## NOTES

- Use `is:inline` for all `<script>` tags in Astro
- No external JS files, everything in new.astro
- DaisyUI theme: `corporate`
- Editor max-width: 800px (A4 style)
- Mobile responsive: Optional (can skip for now)

---

## IMPLEMENTATION ORDER

1. HTML structure + CSS
2. Editor.js initialization
3. AlertBlock class
4. Navigator
5. Properties panel
6. Add Block menu
7. Save & Preview

---

IMPLEMENT THIS COMPLETE SPECIFICATION IN A SINGLE FILE: templates/dashboard/src/pages/new.astro
