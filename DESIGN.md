# DESIGN.md

Design reference for the website: a calm **NieR:Automata** menu look, light and dark. Tokens live in `src/app/globals.css`.

## Principles

1. **Flat and quiet.** Beige/charcoal surfaces, thin outlines, hard offset shadows. No gradients, glows or neon.
2. **System-log voice.** Headings as code comments, directory listings, timestamps, `> ` prompts, blinking `_` cursors.
3. **Readable first.** Effects stay on the home page UI. Article text and code blocks stay calm.
4. **Evidence over decoration.** The design serves the content (projects, articles, timeline).

## Colour

Light theme (default):

| Token | Value | Use |
| --- | --- | --- |
| `--nier-bg` / `terminal-bg` | `#d1cbb7` | page background |
| `--nier-ink` / `terminal-text` | `#4b463a` | text, borders |
| `terminal-accent` | `#8a7a5a` | headings, section titles |
| `terminal-link` | `#5a4a2a` | links |
| `terminal-strong` | `#6a5a3a` | emphasis, values |
| `terminal-comment` | `#9a8a6a` | labels, timestamps, muted text |
| `terminal-border` | `#c4b590` | inline-code and table backgrounds |

Dark theme (`html[data-theme="dark"]`) is the same palette inverted: bg `#26231d`, ink `#d1cbb7`, accent `#b5a47a`, link `#e0cfa0`, strong `#cdbb8c`, comment `#8f8468`, border `#4a4435`.

Always use the CSS variables, never hard-coded light-theme hex values, so both themes work. Overlays use `rgba(var(--nier-ink-rgb), alpha)`.

## Typography

- Roboto Mono everywhere.
- Section titles: normal weight, wrapped as `/* Title */` (see `Section.tsx`).
- Article headings: bold, accent colour, no text shadow.

## Components

- **`.nier-box`**: 1px ink border, square corners, 3px 3px hard offset shadow, faint ink tint. Used for About, Contact rows, Intel cards, status plate, buttons.
- **Hover:** `a.nier-box` and `.nier-row` invert (ink background, bg-coloured text) with a short stepped glitch.
- **Archives:** `ls -l` style listing. Internal entries use `drwxr-xr-x`, external GitHub repos use `lrwxr-xr-x … github ↗` and open in a new tab.
- **Data Logs:** `TIMESTAMP: [YYYY.MM.DD_HH:MM]` then `> text`. Shows 5 at first, `[ LOAD MORE ]` / `[ COLLAPSE ]`, counter `n/total logs_`. Entries may have `[ SOURCE ]` links. Tone: a 9S-style field report.
- **Status plate (`LocationBadge`):** GEO, HQ, STATE, OFFICIAL_LAUNCH. Fixed beside the theme toggle on large screens, inline on small ones, opaque, fades out after 40px of scroll.
- **Theme toggle:** `[ DARK ]` / `[ LIGHT ]`, fixed top-right, choice saved in `localStorage` and defaulting to the system setting. An inline script in `layout.tsx` sets the theme before paint.
- **Contact links:** boxed rows with an inline SVG icon (currentColor), label and `>` marker.
- **Code blocks (`CodeBlock`):** dark panel (`#3b372c`, bar `#2f2c23`) in both themes, toolbar with `[ copy ]` and optional `[ download ]`. Syntax colours are muted earth tones (sage strings, gold properties, mauve keywords, terracotta numbers). No glow.
- **Tables:** bordered, header on the border colour, scroll horizontally on small screens.
- **Images:** `TerminalImage`, a bordered frame with a bracketed caption `[ caption ]` and a click-to-zoom modal.

## Motion

Short stepped transitions only (`steps()`), a blinking cursor (`.nier-blink`) and the hover glitch. Respect `prefers-reduced-motion`.

## Layout

- Home: two columns from `md`, centred container up to `max-w-304`. Left: About, Contact, Data Logs, InMemory Intel. Right: Archives, Certifications.
- Article page: single column, `max-w-4xl`, sticky `← Back to Portfolio` bar.
- Section content is indented (`ml-6`) under its `/* */` title and limited to about 560px.

## Do / Don't

- Do reuse `.nier-box`, `.nier-row`, `Section`, and the CSS variables.
- Do check both themes and mobile width.
- Don't add neon colours, glows, gradients or extra animation to reading pages.
- Don't hard-code colours that only work on the light theme.
