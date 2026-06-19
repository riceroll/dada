# 搭搭 Dada

A Vite + React prototype for a campus lightweight social app.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This repo includes `.github/workflows/deploy.yml`.

After pushing to GitHub:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to the `main` branch.
5. GitHub Actions will build `dist/` and deploy it to GitHub Pages.

The Vite `base` is set to `./`, so the site works both as a project page and under a custom domain.
