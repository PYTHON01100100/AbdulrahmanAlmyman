# CLAUDE.md

Reference for working on this repo with Claude Code. This is the source of Abdulrahman Almyman's personal website, live at https://www.abdulrahmanalmyman.dev/ (GitHub Pages, DNS on Cloudflare). License: GPL-3.0. Visual rules are in [DESIGN.md](DESIGN.md).

## Stack

- Next.js 16 (App Router, `output: "export"`, `distDir: "dist"`), React 19, TypeScript
- Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`)
- Markdown content rendered with `react-markdown` + `remark-gfm`, `rehype-raw`, `rehype-prism-plus`
- Deploy: GitHub Actions (`.github/workflows/nextjs.yml`) to GitHub Pages

## Commands

```bash
npm install
npm run dev      # next dev --turbopack, http://localhost:3000
npm run build    # tsc --noEmit && next build  (static site goes to dist/)
```

Always run a build before pushing. The CI build fails on TypeScript errors and on unknown code-fence languages.

## Layout

- `src/app/page.tsx`: home page. Holds the in-memory data: `dataLogs`, `intelData` (articles), `certsData`, `contactData`, `archiveRepos`.
- `src/app/case-study/[id]/`: article page (`page.tsx` server, `CaseStudyClient.tsx` client renderer).
- `src/app/components/`: UI pieces (`DataLogs`, `ArchiveList`, `ContactList`, `LocationBadge`, `ThemeToggle`, `CodeBlock`, ...).
- `src/data/*.md`: articles. `template.md` is the front-matter template.
- `src/lib/`: markdown and front-matter loaders (server only).
- `public/`: static files served from the site root (images, downloadable YAML and `.drawio`).

## Content rules

- An article is one Markdown file in `src/data/`. Front matter is keyed by the file name:
  ```yaml
  ---
  my-article:
    name: Title
    caseStudyId: my-article
    description: One sentence
    repo: ""
    url: ""
    images: []
    show: true
    date: "YYYY-MM-DD"
    type: "blog"   # "project" lists it in Archives, "blog" in InMemory Intel
  ---
  ```
- Blog entries must also be added to `intelData` in `page.tsx` to appear on the home page.
- Code fences must use a language Prism knows (`bash`, `yaml`, `text`, ...). `env` breaks the build.
- Code block extras go in the fence meta: ` ```yaml title="x.yaml" download="/path/x.yaml" `.
- Use root-relative asset paths (`/folder/file.png`). `CaseStudyClient` prefixes the site base path at runtime.
- Tables are supported (GFM).
- Never publish secrets, internal IPs, node names or real namespaces. Use placeholders (`your-namespace`, `<your-node-name>`).
- Write articles in first person, English, in the same structure as existing ones.

## Gotchas

- `.gitignore` has `/*.md`, so root Markdown files need `git add -f`.
- GitHub's `configure-pages` step injects `basePath` at build time from the Pages URL. If the custom domain changes, redeploy so the build picks it up. Case-study pages are served without a trailing slash (`trailingSlash: false`).
- Canonical URL is `https://www.abdulrahmanalmyman.dev` (set in `layout.tsx`, `sitemap.ts`, `robots.ts`). The bare domain redirects to `www`.
- Pushing from this machine works over HTTPS (`git push https://github.com/PYTHON01100100/AbdulrahmanAlmyman.git main`), not SSH.
- Git warns about LF/CRLF on Windows. It is harmless.
- `src/data/Serving-Large-Language-Models-...-main/` is an untracked local source folder. Do not commit it.

## Style of work

- Keep edits small and match the surrounding code.
- Don't add glow/neon effects (see DESIGN.md). Readability first on article pages.
- Check the light and the dark theme for any UI change.
