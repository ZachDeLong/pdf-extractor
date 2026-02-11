# pdf pages

Extract specific pages from textbook PDFs and merge multiple PDFs. Runs entirely in the browser — no uploads, no server, no file size limits.

## Features

- **Extract pages** — select ranges like `1-26, 30, 45-50` with an optional offset to skip intro pages (title page, TOC, etc.)
- **Merge PDFs** — combine multiple PDFs with drag-to-reorder
- **Dark/light mode** — warm theme with no flash on page load
- **Offline capable** — all processing happens client-side via [pdf-lib](https://github.com/Hopding/pdf-lib)

## Development

```bash
npm install
npm run dev
```

## Tech

Next.js 16, TypeScript, Tailwind CSS v4, pdf-lib, deployed as a static site on Vercel.
