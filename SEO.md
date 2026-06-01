# SEO setup for VoxGraph Web

Technical SEO is implemented in code (metadata, JSON-LD, sitemap, `/about`).  
**Ranking #1 for every name query takes weeks** and depends on backlinks + Search Console — not code alone.

## 1. Vercel environment variables

Set on **voxgraph-web** → Settings → Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://voxgraph-web.vercel.app
NEXT_PUBLIC_AUTHOR_NAME=Surya Raj
NEXT_PUBLIC_AUTHOR_FULL_NAME=Surya Raj Salve
NEXT_PUBLIC_AUTHOR_URL=https://github.com/suryaraj05
NEXT_PUBLIC_AUTHOR_LINKEDIN=https://www.linkedin.com/in/salve-surya-raj
```

After Google Search Console verification (step 2), add:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=paste_token_from_google
```

Optional Bing:

```env
NEXT_PUBLIC_BING_SITE_VERIFICATION=paste_token_from_bing
```

Redeploy after any change.

## 2. Google Search Console (required)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://voxgraph-web.vercel.app`
3. Verify via **HTML tag** → copy token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
4. Submit sitemap: `https://voxgraph-web.vercel.app/sitemap.xml`
5. Request indexing for:
   - `/`
   - `/about`
   - `/try`
   - `/docs`
   - `/docs/build-log`

## 3. Bing Webmaster Tools

1. [Bing Webmaster](https://www.bing.com/webmasters)
2. Import from Google Search Console OR verify manually
3. Submit same sitemap URL

## 4. Entity mapping (name ↔ project)

| Entity | Canonical URL |
|--------|----------------|
| VoxGraph (product) | https://voxgraph-web.vercel.app |
| Surya Raj (person) | https://voxgraph-web.vercel.app/about |
| Code repo | https://github.com/suryaraj05/voxgraph |

**Do on every profile (same spelling):**

- **GitHub** bio: `Built VoxGraph — open-source voice AI starter kit → voxgraph-web.vercel.app`
- **LinkedIn** Featured: link to site + GitHub
- **LinkedIn** About: mention VoxGraph with URL

## 5. Backlinks (strongest ranking signal)

Link **to** `https://voxgraph-web.vercel.app` from:

- [x] voxgraph GitHub README (top banner)
- [ ] LinkedIn posts + profile featured
- [ ] GitHub profile README (`suryaraj05/suryaraj05`)
- [ ] Dev.to / Medium article (even short)
- [ ] Portfolio site if you have one

Use anchor text variety: `VoxGraph`, `voice AI starter kit`, `Surya Raj VoxGraph`.

## 6. Custom domain (recommended)

`voxgraph-web.vercel.app` is weaker for brand search than:

- `voxgraph.dev`
- `voxgraph.io`
- `getvoxgraph.com`

Point domain in Vercel → update `NEXT_PUBLIC_SITE_URL` → resubmit sitemap in Search Console.

## 7. What we implemented in code

- Expanded `keywords` + author name variants in `lib/site.ts`
- JSON-LD `@graph`: WebSite, Person, SoftwareSourceCode, SoftwareApplication
- `/about` page for **Surya Raj** / **projects by Surya Raj** queries
- `sitemap.xml` includes `/about`
- `robots.txt` + `public/llms.txt` for crawlers
- `rel="author"` / `rel="me"` links in layout
- Per-page Open Graph + canonical URLs via `lib/seo.ts`

## 8. Realistic expectations

| Query | Difficulty | Notes |
|-------|------------|-------|
| `VoxGraph` / `voxgraph` | Medium | Own the brand; may take 2–8 weeks |
| `voice AI starter kit` | Hard | Competes with many tutorials |
| `Surya Raj` | Hard | Competes with LinkedIn, others with same name |
| `Surya Raj Salve` | Easier | More unique — `/about` helps |

You cannot guarantee #1 for all queries. Consistent posts + backlinks beat more meta tags.

## 9. Monthly checklist

- [ ] Search Console → Performance → top queries
- [ ] Fix any “Not indexed” URLs
- [ ] New blog post or LinkedIn post linking to `/docs` or `/try`
- [ ] Update `lastModified` content on docs (Google favors fresh pages)
