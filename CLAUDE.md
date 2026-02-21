# CLAUDE.md

This file provides guidance for AI assistants working on this repository.

## Project Overview

This is a **static personal portfolio website** for Yalin Yorulmaz, hosted on GitHub Pages at `https://ylnyorulmaz.github.io`. It is built with plain HTML5, CSS3, and vanilla JavaScript — no build tools, no frameworks, no package manager.

## Repository Structure

```
ylnyorulmaz.github.io/
├── index.html                      # Main portfolio homepage
├── style.css                       # Complete stylesheet (~1050 lines)
├── script.js                       # Vanilla JS functionality (~88 lines)
├── favicon.svg                     # SVG favicon
├── 404.html                        # Custom 404 error page
├── robots.txt                      # SEO robots directives
├── sitemap.xml                     # XML sitemap (update when adding pages)
├── yalinyorulmaz.jpeg              # Profile photo
├── Yalin_Yorulmaz_CV.pdf           # Downloadable CV
├── images/
│   └── preview.svg                 # Open Graph preview image
├── football-iq/
│   └── index.html                  # Daily Sports Trivia project page
├── lumina-tarot/
│   └── index.html                  # Lumina Tarot project page
└── pin-point/
    └── index.html                  # PinPoint project page
```

`archive-alternative-design.html` is a design backup — do not ship or link it.

## Technology Stack

- **HTML5** — semantic markup, ARIA attributes, Schema.org structured data
- **CSS3** — custom properties (variables), Grid, Flexbox, `@keyframes` animations, backdrop filters (glassmorphism), `prefers-reduced-motion` media query
- **JavaScript (ES6+)** — vanilla only, no libraries or frameworks
- **Google Fonts** — Inter (400/500/600/700), loaded via CDN with `preconnect`
- **Font Awesome** — icons via CDN with SRI integrity hashes
- **Formspree** — contact/email form backend (no server-side code needed)

## Development Workflow

### Local Development

There is no build step. Serve the root directory with any static file server:

```bash
python -m http.server 8000
# or
npx http-server
# or
php -S localhost:8000
```

Then open `http://localhost:8000`.

### Deployment

Pushing to the `main` branch automatically deploys to GitHub Pages. No CI/CD pipeline or build process is involved — files are served as-is.

### Branching

- `main` — production branch, auto-deployed to GitHub Pages
- Feature branches should be prefixed with `claude/` when created by AI assistants

## Key Conventions

### HTML

- Use **semantic HTML5** elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, etc.)
- Every interactive element must have a visible **focus state** and appropriate `aria-*` attributes
- Maintain the **heading hierarchy** (`h1` → `h2` → `h3`) — only one `h1` per page
- Images require meaningful `alt` text; decorative images use `alt=""`
- Add `width` and `height` attributes to images to prevent layout shift (CLS)
- Use `loading="lazy"` on below-the-fold images

### CSS

- All design tokens are defined as **CSS custom properties** at `:root` in `style.css` — never hard-code colors, shadows, or spacing
- Dark mode is the **default** color scheme (`color-scheme: dark`)
- Animations must respect `@media (prefers-reduced-motion: reduce)` — wrap motion-heavy rules in the inverse query or disable them inside that query
- Use hardware-accelerated properties for animation: `transform` and `opacity`; avoid animating `width`, `height`, `top`, `left`
- Follow the existing **glassmorphism** design language: semi-transparent backgrounds with `backdrop-filter: blur()` and subtle borders
- Mobile-first responsive design; breakpoints are defined in the existing stylesheet

### JavaScript

- **No external libraries** — keep it vanilla ES6+
- Use `IntersectionObserver` for scroll-triggered effects (fallback provided for older browsers)
- Attach scroll/resize listeners with `{ passive: true }` to avoid blocking the main thread
- Debounce scroll event handlers (pattern already in `script.js`)
- Prefer `addEventListener` over inline handlers

### SEO & Meta Tags

- Every page needs: `<title>`, `<meta name="description">`, canonical `<link>`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), and Twitter Card tags
- Update `sitemap.xml` whenever a new page is added or removed
- Structured data (Schema.org `Person` type) lives in `index.html` — update if personal info changes

### Security

- CDN resources (Font Awesome) include **SRI integrity hashes** (`integrity` + `crossorigin` attributes) — regenerate hashes if upgrading CDN versions
- The email signup form includes a **honeypot field** for spam protection — preserve it when modifying the form

### Performance

- Use `<link rel="preconnect">` and `<link rel="dns-prefetch">` for all third-party origins
- Preload only truly critical resources
- Keep JavaScript files small; no bundlers means every byte is literal

## Adding a New Project

1. Create a directory `/<project-slug>/index.html` following the pattern of existing project pages (`/pin-point/index.html`, etc.)
2. Add a project card to the projects grid in `index.html`
3. Add the new URL to `sitemap.xml` with a `<lastmod>` date
4. Optionally add an Open Graph image to `images/`

## File Ownership Summary

| File | Purpose | Edit frequency |
|---|---|---|
| `index.html` | Main portfolio page | High |
| `style.css` | All styles for the site | High |
| `script.js` | Interactivity (nav, scroll, animations) | Low |
| `sitemap.xml` | Search engine page index | On page add/remove |
| `robots.txt` | Crawler directives | Rarely |
| `404.html` | Custom not-found page | Rarely |
| `*/index.html` | Individual project detail pages | Per-project |

## Contact & Links

- Email: yorulmaz@sabanciuniv.edu
- GitHub: https://github.com/ylnyorulmaz
- LinkedIn: https://www.linkedin.com/in/yalin-yorulmaz
- Itch.io: https://ylnyorulmaz.itch.io
