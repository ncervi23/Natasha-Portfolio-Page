# Natasha Cervi — Portfolio Site

Static implementation of the 4 desktop frames from the Figma file
**Portfolio – Website** (`Wireframes` page): Home, Work, Resume, Contact.

```
portfolio-site/
├── index.html      ← Home
├── work.html       ← Selected Work
├── resume.html     ← Experience & Skills
├── contact.html    ← Contact
├── css/styles.css  ← all styles (design tokens in :root)
├── js/site.js      ← mobile nav toggle
└── assets/         ← images exported from Figma
```

## Fonts
Poppins (400/500/600/700) + Inter (500), loaded from Google Fonts in each page's `<head>`.

## Using this on Squarespace

Squarespace doesn't host raw HTML files on a normal plan, so pick one of these routes:

### Option A — Full-page code blocks (most common)
1. In Squarespace, create 4 blank pages: **Home**, **Work**, **Resume**, **Contact**
   (use a blank/fluid-engine layout, remove the default section padding).
2. For each page, add a **Code Block** and paste the contents of the matching
   `.html` file — but **strip** the `<html>`, `<head>`, `<body>` wrapper tags and
   keep only what is inside `<body>`, plus the `<link>`/`<script>` tags.
3. Paste the full contents of `css/styles.css` into
   **Website → Utilities → Website Tools → Custom CSS** (or a `<style>` tag in
   each code block).
4. Upload every file from `assets/` to Squarespace
   (add them via a gallery/page upload or Custom Files in the CSS editor) and
   replace `assets/...` paths in the HTML with the uploaded file URLs.
5. Add the Google Fonts `<link>` tag to
   **Settings → Advanced → Code Injection → Header**.

> Tip: link nav `<a href>`s to your Squarespace page slugs
> (e.g. `/work`, `/resume`, `/contact`) instead of the `.html` filenames.

### Option B — Host the folder as-is and point your domain
Host `portfolio-site/` on any static host (Squarespace doesn't offer static
hosting; GitHub Pages / Netlify / Vercel are free), then connect it to your
domain's DNS or a subdomain (e.g. `portfolio.yourdomain.com`).

## Things to finish
- `resume.html` links to `assets/Natasha-Cervi-Resume.pdf` — drop your real
  resume PDF into `assets/` with that name.
- "VIEW CASE STUDY" links on the Work page point to `#` until you create the
  case-study pages.
