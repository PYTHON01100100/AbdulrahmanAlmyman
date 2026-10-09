---
abdulrahman-almyman-portfolio:
  name: This Website - A NieR:Automata Portfolio
  caseStudyId: abdulrahman-almyman-portfolio
  description: Why I rebuilt my portfolio in a NieR:Automata style, how it works, and how it is meant to put my brand and experience on a global stage.
  repo: "https://github.com/PYTHON01100100/AbdulrahmanAlmyman"
  url: "https://python01100100.github.io/AbdulrahmanAlmyman/"
  images: []
  show: true
  date: "2026-10-09"
  type: "project"
---

Publish date: `2026-10-09`

# This Website: A NieR:Automata Portfolio

This website is my main project: the [AbdulrahmanAlmyman](https://github.com/PYTHON01100100/AbdulrahmanAlmyman) repository itself. This page explains the idea behind the site, why it looks the way it does, and what I want it to do for me.

- **Live site:** [abdulrahmanalmyman.dev](https://abdulrahmanalmyman.dev) (also on [GitHub Pages](https://python01100100.github.io/AbdulrahmanAlmyman/))
- **Source code:** [github.com/PYTHON01100100/AbdulrahmanAlmyman](https://github.com/PYTHON01100100/AbdulrahmanAlmyman)

## The idea

A CV is a list of claims. A portfolio is supposed to be the evidence. My goal was a site where a recruiter, an engineer or a hiring manager can see, in a few minutes:

- **what I do:** cloud infrastructure, Kubernetes, DevOps and AI/LLM platforms,
- **how I think:** written case studies and blog posts that explain decisions, not only results,
- **what I have proven:** certifications and real projects, each one with its own page.

So the site is built around content, not decoration. Every project and article is a plain Markdown file, so publishing a new one is a single file and a `git push`.

## Why the NieR:Automata style?

Most developer portfolios look the same: a dark gradient, a hero section, a grid of cards. I wanted mine to be remembered.

NieR:Automata has one of the most distinctive interfaces in games: a flat beige-grey palette, thin outlines, hard offset shadows, a faint diagonal hatch and grid in the background, and menus that glitch when you select them. It is calm, a bit melancholic, and instantly recognisable. It also happens to suit a technical site, because it already looks like a terminal or a system log.

I translated that into the interface:

- **Palette and background:** the parchment colours, the diagonal hatch and fine grid, and the dark bars at the screen edges.
- **Sections:** headings written as code comments, like `/* About */`.
- **Boxes and rows:** bordered panels with a hard offset shadow that invert their colours with a short glitch when you hover, like selecting a menu item.
- **Archives:** the project list is a directory listing (`ls -l /archives`) with a blinking cursor at the end.
- **Data Logs:** short, mission-log style updates, newest first.
- **InMemory Intel:** my articles, shown as numbered memory entries.
- **Dark mode:** the same palette inverted into warm charcoal with parchment text, saved in your browser and following your system setting by default.

I kept the effects restrained on the reading pages. A case study should be comfortable to read for ten minutes, so code blocks are a clear dark panel with a copy button, and the glow effects were removed from the article text.

## How it is built

- **Next.js** with static export, so the whole site is plain files that can sit on GitHub Pages with no server to run or pay for.
- **Markdown case studies** with a small front-matter header (name, date, type, description). The type decides where an entry shows up: `project` entries go to the Archives, `blog` entries to InMemory Intel.
- **GitHub Actions** builds and deploys the site on every push to `main`.
- **Tailwind CSS** with a few CSS variables for the theme, which is what made the dark mode a small change instead of a rewrite.
- **Search-friendly metadata:** a sitemap, `robots.txt`, structured data and bilingual keywords (English and Arabic), so people can find me whichever way they search for my name.

## My own domain: Cloudflare DNS + GitHub Pages

A personal brand needs an address that belongs to you, so I bought the domain **abdulrahmanalmyman.dev** and put its DNS on **Cloudflare**, while GitHub Pages hosts the site for free. Here are the steps if you want to do the same.

### 1. Put the domain on Cloudflare

1. Buy the domain (from Cloudflare Registrar or any registrar).
2. In Cloudflare, choose **Add a domain** and enter it, then pick the free plan.
3. If you bought it somewhere else, copy the two **nameservers** Cloudflare gives you into your registrar's nameserver settings. DNS now runs from Cloudflare (this can take from minutes to a few hours).

### 2. Add the DNS records

In Cloudflare go to **DNS → Records** and add:

| Type | Name | Content | Proxy |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `python01100100.github.io` | DNS only |

Those four IPs are GitHub Pages' addresses for an apex (root) domain, and the CNAME sends `www` to your GitHub Pages site. Check them against the [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) before you use them, in case they change.

Keep the records on **DNS only** (grey cloud) at first. GitHub has to reach the domain directly to issue the HTTPS certificate.

### 3. Tell GitHub Pages about the domain

1. Open the repository, then **Settings → Pages**.
2. Under **Custom domain**, enter `abdulrahmanalmyman.dev` and save. GitHub checks the DNS records.
3. When the check passes, tick **Enforce HTTPS**. The certificate can take a few minutes to appear.

The site is deployed with GitHub Actions, so you set the domain in these settings. You don't need a `CNAME` file in the repo.

### 4. Optional hardening

- **Verify the domain** in your GitHub account's Pages settings (it gives you a TXT record to add in Cloudflare). This stops anyone else from taking over your domain name on GitHub Pages.
- If you later switch the records to **Proxied** (orange cloud) for Cloudflare's CDN and protection, set Cloudflare **SSL/TLS** mode to **Full (strict)**. Otherwise you can get redirect loops.
- Redirect `www` to the root domain, or the other way round, so there is one canonical address.

### 5. Update the site itself

Once the domain works, the site no longer lives under `/AbdulrahmanAlmyman/` but at the root. I updated the canonical URL, sitemap and Open Graph tags to use `https://abdulrahmanalmyman.dev`, so search engines index the custom domain.

## A new version, and the old one

This project is the current portfolio. My first portfolio is now the **old version**, kept for reference only:

- Old live site: [python01100100.github.io/Abdulrahman_Almyman_Portfolio](https://python01100100.github.io/Abdulrahman_Almyman_Portfolio/)
- Old source code: [github.com/PYTHON01100100/Abdulrahman_Almyman_Portfolio](https://github.com/PYTHON01100100/Abdulrahman_Almyman_Portfolio)

The old version was a static page that told people about me. The current one is a system that lets me keep publishing: a project archive, a blog, a log of updates, a theme, and a deployment pipeline. It is a portfolio I can grow for years, instead of one I have to rebuild.

## The goal: a brand that is not limited to Saudi Arabia

I am proud of where I come from, and the Saudi tech scene gave me my start. But I want my name to mean something to engineers and employers anywhere, not only in the Kingdom. The site is designed with that in mind:

- **English first.** Every case study is written in English, in the way international teams write: problem, approach, architecture, what went wrong.
- **Global credentials.** Certifications from AWS and Alibaba Cloud, and write-ups on tools used all over the world: Kubernetes, vLLM, LiteLLM, and KEDA.
- **Local roots, visible.** The Arabic keywords and name in the metadata keep me findable at home while the content speaks to everyone.
- **A recognisable identity.** A memorable visual style makes the site, and so the name behind it, easier to recall than a standard template.

## A CV that shows the work behind it

The second goal is to make my experience easy to verify. My time at **SCCC (by stc)** shaped much of my cloud, DevOps and AI platform skills, and I do not want that to be a single line on a CV. So the site connects each claim to evidence:

| What a CV says | Where the site shows it |
| --- | --- |
| Kubernetes and cloud-native skills | The Kubernetes learning journey posts, the K3s homelab, KEDA and zero-downtime deployment case studies |
| Alibaba Cloud and AWS expertise | ALB on ACK, serving LLMs on ACK, AWS cost-alert automation, the ACA and AWS certifications |
| AI and LLM engineering | Image captioning with AWS and Hugging Face, and the multi-model LiteLLM + vLLM platform on ACK |
| DevOps and automation | End-to-end automated deployment on Azure, GitHub collaboration, and this site's own CI/CD |
| Communication | The articles themselves, written to teach, with diagrams and downloadable files |

Instead of "experienced in Kubernetes", a reader can open a page and see how I set up a cluster, what broke, and how I fixed it.

## What is next

- More write-ups drawn from real platform work, with diagrams and reproducible manifests.
- A sharper, evidence-based CV that links straight to these case studies.
- Keeping the Data Logs alive, so the site shows what I am learning right now.

If you are hiring, collaborating, or just curious about the build, the code is open. Take a look at the [repository](https://github.com/PYTHON01100100/AbdulrahmanAlmyman), or get in touch through the contact links on the home page.
