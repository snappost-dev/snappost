# SNAPPOST DASHBOARD TEMPLATE - CURSOR SETUP GUIDE

Sen bir AI asistansın ve dashboard template'ini kuruyorsun. Her adımı sırayla takip et.

**ÖNEMLİ:** Bu dashboard, shell ile AYNI D1 database'i kullanır!

---

## ADIM 1: PROJE KURULUMU

Yeni Astro SSR dashboard oluştur:

```bash
npm create astro@latest . -- --template minimal --typescript strict --install
npx astro add cloudflare -y
npx astro add tailwind -y
npm install bcryptjs @types/bcryptjs
```

---

## ADIM 2: CONFIG DOSYALARI

### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [tailwind()]
});
```

### wrangler.toml
```toml
name = "snappost-dashboard"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "snappost-shell-dev"
database_id = "AYNI-DATABASE-ID-SHELL-ILE"
# ↑ Shell'deki wrangler.toml'dan aynı database_id'yi kopyala!

[vars]
ADMIN_PASSWORD = "changeme"
# Kullanıcı ilk login'de bu password'ü kullanacak
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "dev:wrangler": "wrangler pages dev --local -- astro dev --port 4322",
    "build": "astro build"
  }
}
```

Port 4322 (shell 8788'de, dashboard 4322'de çalışsın)

---

## ADIM 3: AUTH MIDDLEWARE

### src/middleware.ts
```typescript
import { defineMiddleware } from 'astro:middleware';

const PUBLIC_ROUTES = ['/login'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // Public route ise auth check'siz geç
  if (PUBLIC_ROUTES.includes(pathname)) {
    return next();
  }
  
  // Cookie kontrolü
  const authCookie = context.cookies.get('auth');
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    return context.redirect('/login');
  }
  
  return next();
});
```

---

## ADIM 4: LOGIN PAGE

### src/pages/login.astro
```astro
---
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'changeme';

let error = '';

if (Astro.request.method === 'POST') {
  const formData = await Astro.request.formData();
  const password = formData.get('password');
  
  if (password === ADMIN_PASSWORD) {
    Astro.cookies.set('auth', 'authenticated', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 gün
    });
    return Astro.redirect('/');
  } else {
    error = 'Incorrect password';
  }
}
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Dashboard</title>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-2xl font-bold mb-6">Dashboard Login</h1>
    
    {error && (
      <div class="bg-red-50 text-red-600 p-3 rounded mb-4">
        {error}
      </div>
    )}
    
    <form method="POST">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Password</label>
        <input 
          type="password" 
          name="password" 
          required
          class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
        />
      </div>
      
      <button 
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      
      <p class="text-xs text-gray-500 mt-4">
        Default password: <code class="bg-gray-100 px-1">changeme</code>
      </p>
    </form>
  </div>
</body>
</html>
```

---

## ADIM 5: LAYOUT

### src/layouts/Dashboard.astro
```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - Dashboard</title>
</head>
<body class="bg-gray-50">
  <header class="bg-white border-b">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">📝 Dashboard</h1>
      <nav class="flex gap-4">
        <a href="/" class="hover:text-blue-600">Posts</a>
        <a href="/new" class="hover:text-blue-600">New Post</a>
        <form method="POST" action="/logout" class="inline">
          <button type="submit" class="text-red-600 hover:text-red-700">Logout</button>
        </form>
      </nav>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 py-8">
    <slot />
  </main>
</body>
</html>
```

---

## ADIM 6: POST LIST

### src/pages/index.astro
```astro
---
import Dashboard from '../layouts/Dashboard.astro';

const postsResult = await Astro.locals.runtime.env.DB
  .prepare('SELECT * FROM posts ORDER BY created_at DESC')
  .all();

const posts = postsResult.results;
---

<Dashboard title="All Posts">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">All Posts</h1>
    <a 
      href="/new"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      + New Post
    </a>
  </div>

  <div class="bg-white rounded-lg border">
    {posts.length === 0 ? (
      <div class="p-8 text-center text-gray-500">
        No posts yet. Create your first post!
      </div>
    ) : (
      <table class="w-full">
        <thead class="border-b bg-gray-50">
          <tr>
            <th class="text-left p-4">Title</th>
            <th class="text-left p-4">Status</th>
            <th class="text-left p-4">Created</th>
            <th class="text-right p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: any) => (
            <tr class="border-b hover:bg-gray-50">
              <td class="p-4 font-medium">{post.title}</td>
              <td class="p-4">
                <span class={`px-2 py-1 rounded text-xs ${
                  post.published 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td class="p-4 text-sm text-gray-600">
                {new Date(post.created_at).toLocaleDateString()}
              </td>
              <td class="p-4 text-right">
                <a 
                  href={`/edit/${post.id}`}
                  class="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</Dashboard>
```

---

## ADIM 7: NEW POST PAGE

### src/pages/new.astro
```astro
---
import Dashboard from '../layouts/Dashboard.astro';
import { marked } from 'marked';

let success = false;
let error = '';

if (Astro.request.method === 'POST') {
  try {
    const formData = await Astro.request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'on' ? 1 : 0;
    
    // Markdown → HTML
    const content_html = marked(content);
    
    const now = new Date().toISOString();
    
    await Astro.locals.runtime.env.DB
      .prepare(
        'INSERT INTO posts (slug, title, description, content, content_html, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(slug, title, description, content, content_html, published, now, now)
      .run();
    
    return Astro.redirect('/');
  } catch (e) {
    error = 'Error creating post: ' + (e as Error).message;
  }
}
---

<Dashboard title="New Post">
  <h1 class="text-3xl font-bold mb-6">Create New Post</h1>

  {error && (
    <div class="bg-red-50 text-red-600 p-4 rounded mb-4">
      {error}
    </div>
  )}

  <form method="POST" class="bg-white rounded-lg border p-6">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input 
          type="text" 
          name="title" 
          required
          class="w-full px-3 py-2 border rounded"
          placeholder="My First Post"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Slug</label>
        <input 
          type="text" 
          name="slug" 
          required
          class="w-full px-3 py-2 border rounded"
          placeholder="my-first-post"
        />
        <p class="text-xs text-gray-500 mt-1">URL: /blog/slug</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <input 
          type="text" 
          name="description"
          class="w-full px-3 py-2 border rounded"
          placeholder="A short description"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Content (Markdown)</label>
        <textarea 
          name="content" 
          required
          rows="15"
          class="w-full px-3 py-2 border rounded font-mono text-sm"
          placeholder="# Hello World&#10;&#10;This is my **first post**!"
        ></textarea>
      </div>

      <div class="flex items-center gap-2">
        <input 
          type="checkbox" 
          name="published" 
          id="published"
          class="w-4 h-4"
        />
        <label for="published" class="text-sm">Publish immediately</label>
      </div>

      <div class="flex gap-2 pt-4">
        <button 
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Post
        </button>
        <a 
          href="/"
          class="px-6 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </a>
      </div>
    </div>
  </form>
</Dashboard>
```

---

## ADIM 8: EDIT POST PAGE

### src/pages/edit/[id].astro
```astro
---
import Dashboard from '../../layouts/Dashboard.astro';
import { marked } from 'marked';

const { id } = Astro.params;

const post = await Astro.locals.runtime.env.DB
  .prepare('SELECT * FROM posts WHERE id = ?')
  .bind(id)
  .first();

if (!post) {
  return Astro.redirect('/');
}

let error = '';

if (Astro.request.method === 'POST') {
  try {
    const formData = await Astro.request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'on' ? 1 : 0;
    
    const content_html = marked(content);
    const now = new Date().toISOString();
    
    await Astro.locals.runtime.env.DB
      .prepare(
        'UPDATE posts SET title = ?, slug = ?, description = ?, content = ?, content_html = ?, published = ?, updated_at = ? WHERE id = ?'
      )
      .bind(title, slug, description, content, content_html, published, now, id)
      .run();
    
    return Astro.redirect('/');
  } catch (e) {
    error = 'Error updating post: ' + (e as Error).message;
  }
}
---

<Dashboard title={`Edit: ${post.title}`}>
  <h1 class="text-3xl font-bold mb-6">Edit Post</h1>

  {error && (
    <div class="bg-red-50 text-red-600 p-4 rounded mb-4">
      {error}
    </div>
  )}

  <form method="POST" class="bg-white rounded-lg border p-6">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input 
          type="text" 
          name="title" 
          required
          value={post.title}
          class="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Slug</label>
        <input 
          type="text" 
          name="slug" 
          required
          value={post.slug}
          class="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <input 
          type="text" 
          name="description"
          value={post.description || ''}
          class="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Content (Markdown)</label>
        <textarea 
          name="content" 
          required
          rows="15"
          class="w-full px-3 py-2 border rounded font-mono text-sm"
        >{post.content}</textarea>
      </div>

      <div class="flex items-center gap-2">
        <input 
          type="checkbox" 
          name="published" 
          id="published"
          checked={post.published === 1}
          class="w-4 h-4"
        />
        <label for="published" class="text-sm">Published</label>
      </div>

      <div class="flex gap-2 pt-4">
        <button 
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
        <a 
          href="/"
          class="px-6 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </a>
      </div>
    </div>
  </form>
</Dashboard>
```

---

## ADIM 9: LOGOUT

### src/pages/logout.astro
```astro
---
if (Astro.request.method === 'POST') {
  Astro.cookies.delete('auth');
  return Astro.redirect('/login');
}

return Astro.redirect('/');
---
```

---

## TAMAMLANDI!

Dashboard hazır. Kullanıcı şimdi:

1. `wrangler.toml`'da shell ile AYNI database_id kullandığından emin ol
2. `npm run dev:wrangler`
3. http://localhost:4322
4. Login: `changeme`
5. Yeni post oluştur → Shell'de görün!

Tüm dosyalar oluşturuldu mu kontrol et.
