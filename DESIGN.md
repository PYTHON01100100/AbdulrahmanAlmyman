# DESIGN.md

Design reference for the website: a calm **NieR:Automata** menu look, with twelve selectable themes. Tokens live in `src/app/globals.css`.

## Principles

1. **Flat and quiet.** Beige/charcoal surfaces, thin outlines, hard offset shadows. No gradients or heavy glow (the optional neon mode allows a soft glow on titles and boxes only).
2. **System-log voice.** YoRHa-menu section headers, directory listings, timestamps, `> ` prompts, blinking `_` cursors.
3. **Readable first.** Effects stay on the home page UI. Article text and code blocks stay calm.
4. **Evidence over decoration.** The design serves the content (projects, articles, timeline).

## Colour themes

All themes map to the same CSS variables (`--nier-bg`, `--nier-ink`, `--nier-ink-rgb`, `--color-terminal-*`). Never hard-code theme colours in components, so everything recolours correctly in every theme. Overlays use `rgba(var(--nier-ink-rgb), alpha)`.

### 01 // YoRHa Light (default)

| Token | Value | Use |
| --- | --- | --- |
| `--nier-bg` / `terminal-bg` | `#d1cbb7` | page background |
| `--nier-ink` / `terminal-text` | `#4b463a` | text, borders |
| `terminal-accent` | `#8a7a5a` | headings, section titles |
| `terminal-link` | `#5a4a2a` | links |
| `terminal-strong` | `#6a5a3a` | emphasis, values |
| `terminal-comment` | `#9a8a6a` | labels, timestamps, muted text |
| `terminal-border` | `#c4b590` | inline-code and table backgrounds |

### 02 // YoRHa Dark (`dark`)

The core palette inverted: bg `#26231d`, ink `#d1cbb7`, accent `#b5a47a`, link `#e0cfa0`, strong `#cdbb8c`, comment `#8f8468`, border `#4a4435`.

### 03 // Hacking Neon (`neon`)

YoRHa hacking screen: teal-black bg `#0c1214`, parchment ink `#d8d2bc`, cyan accent `#4fe3d7`, YoRHa red links `#ff6a5a`. The only theme with a glow, and it is limited to titles and `.nier-box`.

### 04 – 12: flat themes (no glow)

| # | Name | `data-theme` | bg | ink | accent | link | comment | border |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 04 | Copland OS Navi (Serial Experiments Lain) | `lain` | `#141416` | `#7c7ff5` | `#a5b4fc` | `#c4b5fd` | `#8b8b96` | `#27272a` |
| 05 | NERV MAGI Cluster (Evangelion) | `evangelion` | `#0a0807` | `#ff7700` | `#d63e00` | `#ffa94d` | `#9a7a62` | `#1c1816` |
| 06 | CODEC Chassis (Metal Gear Solid) | `mgs1` | `#0e1410` | `#52c48a` | `#10fa84` | `#6ee7b7` | `#6f8f7c` | `#1a2920` |
| 07 | Retro Groove (Gruvbox Dark) | `gruvbox` | `#282828` | `#ebdbb2` | `#fabd2f` | `#83a598` | `#a89984` | `#3c3836` |
| 08 | Catppuccin Mocha | `catppuccin` | `#1e1e2e` | `#cdd6f4` | `#89b4fa` | `#cba6f7` | `#9399b2` | `#313244` |
| 09 | Canonical Shell (Ubuntu Terminal) | `ubuntu` | `#300a24` | `#eeeeec` | `#e95420` | `#f6a87e` | `#b08aa6` | `#4d1c3b` |
| 10 | Akira Neo-Tokyo | `akira` | `#0d0c0c` | `#f4f2f0` | `#e51313` | `#ff4d4d` | `#817a75` | `#261212` |
| 11 | Netrunner Cyberdeck (Cyberpunk) | `cyberpunk` | `#06090e` | `#38f2a6` | `#8432d6` | `#00b4d8` | `#697c99` | `#111827` |
| 12 | Ghost in the Shell | `gits` | `#000200` | `#4af24a` | `#1e821e` | `#86efac` | `#318931` | `#092409` |

Contrast rule: text tokens (ink, link, strong, comment) need at least 4.5:1 against the background, accents used on headings at least 3:1. To meet it, Lain's ink was lifted from the proposed `#6366f1` (4.1:1), Gruvbox's comment from `#928374` (4.0:1) and Catppuccin's comment from `#7f849c` (4.4:1). Akira, Cyberpunk and Ghost in the Shell had their comment colours lifted (from `#5a5552`, `#374151` and `#163e16`), and Cyberpunk's accent from `#7928ca`.

## Typography

- Roboto Mono everywhere.
- Section titles: a YoRHa menu header bar (see **Section headers** below), not plain text.
- Article headings: bold, accent colour, no text shadow.

## Components

- **Section headers (`Section.tsx`, `.nier-heading`):** each home-page section title is a solid bar in the ink colour with the title in the background colour, uppercase with wide letter spacing and a small diamond marker (`::before`), followed by a dotted rule (`.nier-heading-dots`, a repeating radial-gradient) that fills the rest of the row, like the bars and dotted separators in the NieR menus. Width is capped at 560px to match the boxes below it. Colours come from `--nier-ink` and `--nier-bg`, so it inverts correctly in every theme. It replaced the old `/* Title */` comment style.
- **`.nier-box`**: 1px ink border, square corners, 3px 3px hard offset shadow, faint ink tint. Used for About, Contact rows, Intel cards, status plate, buttons.
- **Hover:** `a.nier-box` and `.nier-row` invert (ink background, bg-coloured text) with a short stepped glitch.
- **Archives:** `ls -l` style listing. Internal entries use `drwxr-xr-x`, external GitHub repos use `lrwxr-xr-x … github ↗` and open in a new tab.
- **About (`page.tsx`):** a YoRHa "personal record" in a `.nier-box`: the header `[ SYSTEM ARCHIVE // PERSONAL RECORD ]`, then `> IDENTITY`, `> STATUS` and `> CLASS` lines (labels in the comment colour, values in the strong colour), short paragraphs that wrap naturally (no hard line breaks), and `> END OF RECORD_` with a blinking cursor. It opens with a text emoticon greeting.
- **Certifications (`CertsList`):** boxed rows with `[ Provider ]` above the title. A certificate with a `url` is a link that opens in a new tab and shows a small `verify ↗` on the right, in the same muted style as the Archives `github ↗`; one without a `url` shows no arrow.
- **Text emoticons:** friendly kaomoji such as `Hi! (^-^)/` open the About box and some articles. Use them sparingly, one per page at most. In Markdown, check the built page: a leading backslash must be doubled (`\\(^_^)/`) and brackets must not be followed by `(`.
- **Data Logs:** `TIMESTAMP: [YYYY.MM.DD_HH:MM]` then `> text`. Shows 5 at first, `[ LOAD MORE ]` / `[ COLLAPSE ]`, counter `n/total logs_`. Entries may have `[ SOURCE ]` links. Tone: a 9S-style field report.
- **Status plate (`LocationBadge`):** GEO_LOCATION, TIME (London, 12-hour with AM/PM, ticking every second), DATE, HIJRI (Umm al-Qura), HQ. Fixed beside the theme toggle on large screens, inline on small ones, opaque, fades out after 40px of scroll.
- **Theme menu (`ThemeToggle.tsx`):** a `[ THEME 0n ]` button, fixed top-right, opens a `.nier-box` list of all the themes as `.nier-row` options (`03 // Hacking Neon`), with a `◆` on the current one. Closes on selection, outside click or Escape. The choice is saved in `localStorage`, and an inline script in `layout.tsx` applies it before first paint (no flash). First-time visitors get light or dark from their system setting.
- **Contact links:** boxed rows with an inline SVG icon (currentColor), label and `>` marker.
- **Code blocks (`CodeBlock`):** panel, toolbar and syntax colours come from `--code-*` and `--syn-*` variables. Light and dark use the warm default panel (`#3b372c`, bar `#2f2c23`, muted earth-tone syntax); every other theme defines its own panel and syntax palette in `globals.css`, with all code text at 4.5:1 contrast or more. Toolbar with `[ copy ]` and optional `[ download ]`. No glow. A new theme should add its own code palette too. In shell blocks (`bash`, `sh`, `powershell`) numbers are not coloured, because the grammar would colour only part of an IP address.
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
- Do check every theme and mobile width.
- Don't add neon colours, glows, gradients or extra animation to reading pages.
- Don't hard-code colours that only work on the light theme.

## Future theme expansion

The theme system must stay extensible without changing existing components.

### Rules

1. Register new themes in the `THEMES` array (`ThemeToggle.tsx`) and in the theme list of the inline script in `layout.tsx`.
2. Define all required CSS variables in `globals.css`.
3. Never hard-code theme-specific colours in components.
4. Preserve the original NieR layout and visual identity.
5. Theme selection happens through the dedicated menu.
6. Store the selected theme in `localStorage`.
7. Apply the stored theme before the first paint.
8. Respect reduced-motion and accessibility settings, including the contrast rule above.
9. Ensure articles remain readable across all themes.
10. New themes must not break existing themes.

### Design philosophy

A theme changes the atmosphere, not the architecture.

NieR:Automata remains the foundation. Other themes reinterpret its visual language without replacing the site's structure or technical identity.
