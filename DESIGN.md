# DESIGN.md

Design reference for the website: a calm **NieR:Automata** menu look in three modes: light, dark and neon. Tokens live in `src/app/globals.css`.

## Principles

1. **Flat and quiet.** Beige/charcoal surfaces, thin outlines, hard offset shadows. No gradients or heavy glow (the optional neon mode allows a soft glow on titles and boxes only).
2. **System-log voice.** YoRHa-menu section headers, directory listings, timestamps, `> ` prompts, blinking `_` cursors.
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

Neon theme (`html[data-theme="neon"]`, optional third mode): still NieR/YoRHa, with a teal-black background `#0c1214`, parchment ink `#d8d2bc`, a cyan accent `#4fe3d7` (the colour of YoRHa's hacking screens), YoRHa red links `#ff6a5a`, and a soft glow limited to titles and `.nier-box`. The toggle cycles light, dark, neon.

Always use the CSS variables, never hard-coded light-theme hex values, so both themes work. Overlays use `rgba(var(--nier-ink-rgb), alpha)`.

## Typography

- Roboto Mono everywhere.
- Section titles: a YoRHa menu header bar (see **Section headers** below), not plain text.
- Article headings: bold, accent colour, no text shadow.

## Components

- **Section headers (`Section.tsx`, `.nier-heading`):** each home-page section title is a solid bar in the ink colour with the title in the background colour, uppercase with wide letter spacing and a small diamond marker (`::before`), followed by a dotted rule (`.nier-heading-dots`, a repeating radial-gradient) that fills the rest of the row, like the bars and dotted separators in the NieR menus. Width is capped at 560px to match the boxes below it. Colours come from `--nier-ink` and `--nier-bg`, so it inverts correctly in all three themes. It replaced the old `/* Title */` comment style.
- **`.nier-box`**: 1px ink border, square corners, 3px 3px hard offset shadow, faint ink tint. Used for About, Contact rows, Intel cards, status plate, buttons.
- **Hover:** `a.nier-box` and `.nier-row` invert (ink background, bg-coloured text) with a short stepped glitch.
- **Archives:** `ls -l` style listing. Internal entries use `drwxr-xr-x`, external GitHub repos use `lrwxr-xr-x … github ↗` and open in a new tab.
- **About (`page.tsx`):** a YoRHa "personal record" in a `.nier-box`: the header `[ SYSTEM ARCHIVE // PERSONAL RECORD ]`, then `> IDENTITY`, `> STATUS` and `> CLASS` lines (labels in the comment colour, values in the strong colour), short paragraphs that wrap naturally (no hard line breaks), and `> END OF RECORD_` with a blinking cursor. It opens with a text emoticon greeting.
- **Certifications (`CertsList`):** boxed rows with `[ Provider ]` above the title. A certificate with a `url` is a link that opens in a new tab and shows a small `verify ↗` on the right, in the same muted style as the Archives `github ↗`; one without a `url` shows no arrow.
- **Text emoticons:** friendly kaomoji such as `Hi! (^-^)/` open the About box and some articles. Use them sparingly, one per page at most. In Markdown, check the built page: a leading backslash must be doubled (`\\(^_^)/`) and brackets must not be followed by `(`.
- **Data Logs:** `TIMESTAMP: [YYYY.MM.DD_HH:MM]` then `> text`. Shows 5 at first, `[ LOAD MORE ]` / `[ COLLAPSE ]`, counter `n/total logs_`. Entries may have `[ SOURCE ]` links. Tone: a 9S-style field report.
- **Status plate (`LocationBadge`):** GEO_LOCATION, TIME (London, 12-hour with AM/PM, ticking every second), DATE, HIJRI (Umm al-Qura), HQ. Fixed beside the theme toggle on large screens, inline on small ones, opaque, fades out after 40px of scroll.
- **Theme toggle:** cycles light, dark, neon, labelled with the next mode (`[ DARK ]`, `[ NEON ]`, `[ LIGHT ]`), fixed top-right, choice saved in `localStorage` and defaulting to the system light or dark setting. An inline script in `layout.tsx` sets the theme before paint.
- **Contact links:** boxed rows with an inline SVG icon (currentColor), label and `>` marker.
- **Code blocks (`CodeBlock`):** dark panel (`#3b372c`, bar `#2f2c23`) in both themes, toolbar with `[ copy ]` and optional `[ download ]`. Syntax colours are muted earth tones (sage strings, gold properties, mauve keywords, terracotta numbers). No glow.
- **Tables:** bordered, header on the border colour, scroll horizontally on small screens.
- **Images:** `TerminalImage`, a bordered frame at the full article width, with a bracketed caption `[ caption ]` and a click-to-zoom modal.

## Motion

Short stepped transitions only (`steps()`), a blinking cursor (`.nier-blink`) and the hover glitch. Respect `prefers-reduced-motion`.

## Layout

- Home: two columns from `md`, centred container up to `max-w-304`. Left: About, Contact, InMemory Intel. Right: Archives, Certifications, Data Logs.
- Article page: single column, `max-w-4xl`, sticky `← Back to Portfolio` bar.
- Section content is indented (`ml-6`) under its header bar and limited to about 560px.

## Do / Don't

- Do reuse `.nier-box`, `.nier-row`, `Section`, and the CSS variables.
- Do check both themes and mobile width.
- Don't add neon colours, glows, gradients or extra animation to reading pages.
- Don't hard-code colours that only work on the light theme.
