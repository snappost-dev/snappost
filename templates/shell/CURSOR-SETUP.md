# SNAPPOST SHELL TEMPLATE - CURSOR SETUP GUIDE

Sen bir AI asistansın ve bu projeyi sıfırdan kuruyorsun. Her adımı sırayla takip et.

---

## ADIM 1: PROJE KURULUMU

Astro SSR blog template oluştur:

```bash
npm create astro@latest . -- --template minimal --typescript strict --install
npx astro add cloudflare -y
npx astro add tailwind -y
npm install marked @types/marked
npm install @tailwindcss/typography
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
name = "snappost-shell"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "snappost-shell-dev"
database_id = "placeholder"
```

### tailwind.config.mjs
```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### package.json scripts ekle
```json
{
  "scripts": {
    "dev": "wrangler pages dev -- astro dev",
    "build": "astro build"
  }
}
```

---

## ADIM 3: LAYOUT

### src/layouts/Base.astro
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;

// D1'den config çek
const configResult = await Astro.locals.runtime.env.DB
  .prepare('SELECT key, value FROM config')
  .all();

const config = Object.fromEntries(
  configResult.results.map((r: any) => [r.key, r.value])
);
---

<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content={description || config.site_description}>
  <meta name="theme-color" content={config.theme_color}>
  <title>{title}</title>
</head>
<body class="bg-gray-50 text-gray-900">
  <header class="bg-white border-b sticky top-0 z-10">
    <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" class="text-xl font-bold">{config.site_title}</a>
      <nav class="flex gap-6">
        <a href="/" class="hover:text-blue-600">Home</a>
        <a href="/blog" class="hover:text-blue-600">Blog</a>
      </nav>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <slot />
  </main>

  <footer class="text-center py-8 text-gray-600 text-sm">
    <p>© {new Date().getFullYear()} {config.author_name}</p>
  </footer>
</body>
</html>
```

---

## ADIM 4: COMPONENTS

### src/components/PostCard.astro
```astro
---
interface Props {
  post: {
    slug: string;
    title: string;
    description: string;
    created_at: string;
  };
}

const { post } = Astro.props;
const date = new Date(post.created_at).toLocaleDateString('tr-TR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
---

<article class="bg-white rounded-lg border p-6 hover:shadow-md transition">
  <a href={`/blog/${post.slug}`} class="block">
    <h2 class="text-2xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
    <p class="text-gray-600 mb-4">{post.description}</p>
    <time class="text-sm text-gray-500">{date}</time>
  </a>
</article>
```

---

## ADIM 5: PAGES

### src/pages/index.astro
```astro
---
import Base from '../layouts/Base.astro';
import PostCard from '../components/PostCard.astro';

const configResult = await Astro.locals.runtime.env.DB
  .prepare('SELECT key, value FROM config')
  .all();

const config = Object.fromEntries(
  configResult.results.map((r: any) => [r.key, r.value])
);

const postsResult = await Astro.locals.runtime.env.DB
  .prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 5')
  .all();

const posts = postsResult.results;
---

<Base title={config.site_title} description={config.site_description}>
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">{config.site_title}</h1>
    <p class="text-xl text-gray-600">{config.site_description}</p>
  </div>

  <div class="space-y-6">
    {posts.map((post: any) => (
      <PostCard post={post} />
    ))}
  </div>
</Base>
```

### src/pages/blog/index.astro
```astro
---
import Base from '../../layouts/Base.astro';
import PostCard from '../../components/PostCard.astro';

const configResult = await Astro.locals.runtime.env.DB
  .prepare('SELECT key, value FROM config')
  .all();

const config = Object.fromEntries(
  configResult.results.map((r: any) => [r.key, r.value])
);

const postsResult = await Astro.locals.runtime.env.DB
  .prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC')
  .all();

const posts = postsResult.results;
---

<Base title={`All Posts - ${config.site_title}`}>
  <h1 class="text-4xl font-bold mb-8">All Posts</h1>

  <div class="space-y-6">
    {posts.map((post: any) => (
      <PostCard post={post} />
    ))}
  </div>
</Base>
```

### src/pages/blog/[slug].astro
```astro
---
import Base from '../../layouts/Base.astro';

const { slug } = Astro.params;

const post = await Astro.locals.runtime.env.DB
  .prepare('SELECT * FROM posts WHERE slug = ? AND published = 1')
  .bind(slug)
  .first();

if (!post) {
  return Astro.redirect('/404');
}

const date = new Date(post.created_at).toLocaleDateString('tr-TR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
---

<Base title={post.title} description={post.description}>
  <article class="prose prose-lg max-w-none">
    <h1>{post.title}</h1>
    <time class="text-gray-500">{date}</time>
    <div set:html={post.content_html} />
  </article>
</Base>
```

---

## ADIM 6: RSS FEED

### src/pages/rss.xml.ts
```typescript
export async function GET(context: any) {
  const db = context.locals.runtime.env.DB;
  
  const configResult = await db.prepare('SELECT key, value FROM config').all();
  const config = Object.fromEntries(
    configResult.results.map((r: any) => [r.key, r.value])
  );
  
  const postsResult = await db.prepare(
    'SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 20'
  ).all();
  
  const posts = postsResult.results;
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${config.site_title}</title>
    <description>${config.site_description}</description>
    <link>https://example.com</link>
    ${posts.map((post: any) => `
    <item>
      <title>${post.title}</title>
      <description>${post.description || ''}</description>
      <link>https://example.com/blog/${post.slug}</link>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    </item>
    `).join('')}
  </channel>
</rss>`;
  
  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

---

## TAMAMLANDI!

Proje yapısı hazır. Kullanıcı şimdi şunları yapacak:

1. `chmod +x setup.sh && ./setup.sh` (D1 setup)
2. `wrangler.toml`'da database_id güncelle
3. `npm run dev`
4. http://localhost:8788 test

Tüm dosyalar oluşturuldu mu? Her adım tamamlandı mı kontrol et.
