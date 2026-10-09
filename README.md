# Abdulrahman Almyman: Personal Website

This is the source code of my personal website and portfolio, built in a **NieR:Automata** style.

**Live site:** [https://www.abdulrahmanalmyman.dev/](https://www.abdulrahmanalmyman.dev/)

The site is hosted on **GitHub Pages**, with the domain `abdulrahmanalmyman.dev` and its DNS managed on **Cloudflare**.

## What is in it

- An about section, contact links, certifications and a timeline of **Data Logs**
- **Archives** of my projects and **InMemory Intel**, my articles on cloud, Kubernetes, DevOps and AI
- Case studies written in Markdown, with code blocks you can copy and files you can download
- A light and a dark NieR theme

## Tech stack

- [Next.js](https://nextjs.org/) (static export) and React
- Tailwind CSS
- Markdown content in `src/data/`
- GitHub Actions to build and deploy to GitHub Pages
- Cloudflare for DNS

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To build the static site:

```bash
npm run build
```

## Adding an article

Add a Markdown file to `src/data/` with a front-matter header (see `src/data/template.md`). Entries with `type: "project"` go to the Archives and entries with `type: "blog"` go to InMemory Intel. Static files such as images and downloads go in `public/`.

## Deployment

Every push to `main` runs the workflow in `.github/workflows/nextjs.yml`, which builds the site and publishes it to GitHub Pages. The custom domain is set in the repository's **Settings → Pages**, and the DNS records live in Cloudflare.

## License

This project is released under the **GNU General Public License v3.0**. See [LICENSE](LICENSE) for the full text.

---

Built by [Abdulrahman Almyman](https://www.abdulrahmanalmyman.dev/) · [GitHub](https://github.com/PYTHON01100100) · [LinkedIn](https://www.linkedin.com/in/abdulrahmanalmyman/)
