-- Snappost Demo Posts
-- Seed data for testing

INSERT INTO posts (slug, title, description, content, content_html, published, created_at, updated_at) VALUES 
(
  'hello-world',
  'Hello World',
  'My first blog post',
  '# Hello World

This is my **first blog post** using Snappost!

## Features

- Fast deployment with Cloudflare Pages
- Markdown support for easy writing
- RSS feed for subscribers
- Clean, minimal design
- SSR rendering for performance

Welcome to my blog!',
  '<h1>Hello World</h1>
<p>This is my <strong>first blog post</strong> using Snappost!</p>
<h2>Features</h2>
<ul>
<li>Fast deployment with Cloudflare Pages</li>
<li>Markdown support for easy writing</li>
<li>RSS feed for subscribers</li>
<li>Clean, minimal design</li>
<li>SSR rendering for performance</li>
</ul>
<p>Welcome to my blog!</p>',
  1,
  '2026-04-01T10:00:00Z',
  '2026-04-01T10:00:00Z'
),
(
  'getting-started',
  'Getting Started with Snappost',
  'Learn how to use Snappost for your blog',
  '# Getting Started

Snappost makes blogging **simple** and **fast**.

## Quick Start

1. Deploy your shell to Cloudflare Pages
2. Write posts in Markdown
3. Publish instantly

That''s it! No complex setup, no hosting headaches.

## Why Snappost?

Snappost is built on modern technologies:

- **Astro** for fast SSR
- **Cloudflare D1** for database
- **Cloudflare Pages** for hosting
- **Tailwind CSS** for styling

Everything runs on the edge for maximum performance.',
  '<h1>Getting Started</h1>
<p>Snappost makes blogging <strong>simple</strong> and <strong>fast</strong>.</p>
<h2>Quick Start</h2>
<ol>
<li>Deploy your shell to Cloudflare Pages</li>
<li>Write posts in Markdown</li>
<li>Publish instantly</li>
</ol>
<p>That''s it! No complex setup, no hosting headaches.</p>
<h2>Why Snappost?</h2>
<p>Snappost is built on modern technologies:</p>
<ul>
<li><strong>Astro</strong> for fast SSR</li>
<li><strong>Cloudflare D1</strong> for database</li>
<li><strong>Cloudflare Pages</strong> for hosting</li>
<li><strong>Tailwind CSS</strong> for styling</li>
</ul>
<p>Everything runs on the edge for maximum performance.</p>',
  1,
  '2026-04-02T12:00:00Z',
  '2026-04-02T12:00:00Z'
),
(
  'markdown-guide',
  'Markdown Guide',
  'How to write in Markdown',
  '# Markdown Guide

Markdown is simple and powerful.

## Headings

Use `#` for headings. More `#` = smaller heading.

## Text Formatting

- **Bold** with `**text**`
- *Italic* with `*text*`
- `Code` with backticks

## Lists

Ordered:
1. First item
2. Second item
3. Third item

Unordered:
- Bullet point
- Another point
- Last point

## Links and Images

[Link text](https://example.com)

![Alt text](https://via.placeholder.com/400x200)

## Code Blocks

```javascript
const greeting = "Hello World";
console.log(greeting);
```

Happy writing!',
  '<h1>Markdown Guide</h1>
<p>Markdown is simple and powerful.</p>
<h2>Headings</h2>
<p>Use <code>#</code> for headings. More <code>#</code> = smaller heading.</p>
<h2>Text Formatting</h2>
<ul>
<li><strong>Bold</strong> with <code>**text**</code></li>
<li><em>Italic</em> with <code>*text*</code></li>
<li><code>Code</code> with backticks</li>
</ul>
<h2>Lists</h2>
<p>Ordered:</p>
<ol>
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ol>
<p>Unordered:</p>
<ul>
<li>Bullet point</li>
<li>Another point</li>
<li>Last point</li>
</ul>
<h2>Links and Images</h2>
<p><a href="https://example.com">Link text</a></p>
<p><img src="https://via.placeholder.com/400x200" alt="Alt text"></p>
<h2>Code Blocks</h2>
<pre><code class="language-javascript">const greeting = &quot;Hello World&quot;;
console.log(greeting);
</code></pre>
<p>Happy writing!</p>',
  1,
  '2026-04-03T09:00:00Z',
  '2026-04-03T09:00:00Z'
),
(
  'draft-post',
  'This is a Draft',
  'Not published yet',
  '# Draft Post

This post is not published yet. It should not appear on the blog or in RSS feed.

Use drafts to work on posts before publishing.',
  '<h1>Draft Post</h1>
<p>This post is not published yet. It should not appear on the blog or in RSS feed.</p>
<p>Use drafts to work on posts before publishing.</p>',
  0,
  '2026-04-04T14:00:00Z',
  '2026-04-04T14:00:00Z'
),
(
  'future-plans',
  'Future Plans for Snappost',
  'What is coming next',
  '# Future Plans

Snappost is evolving! Here is what is coming:

## Phase 2: Ad Integration

- Prebid.js support
- Custom ad slots
- Revenue tracking

## Phase 3: Premium Templates

- Magazine layout
- Portfolio theme
- Listicle template

## Phase 4: Advanced Features

- Analytics dashboard
- A/B testing
- Custom domains

Stay tuned!',
  '<h1>Future Plans</h1>
<p>Snappost is evolving! Here is what is coming:</p>
<h2>Phase 2: Ad Integration</h2>
<ul>
<li>Prebid.js support</li>
<li>Custom ad slots</li>
<li>Revenue tracking</li>
</ul>
<h2>Phase 3: Premium Templates</h2>
<ul>
<li>Magazine layout</li>
<li>Portfolio theme</li>
<li>Listicle template</li>
</ul>
<h2>Phase 4: Advanced Features</h2>
<ul>
<li>Analytics dashboard</li>
<li>A/B testing</li>
<li>Custom domains</li>
</ul>
<p>Stay tuned!</p>',
  1,
  '2026-04-05T16:00:00Z',
  '2026-04-05T16:00:00Z'
);
