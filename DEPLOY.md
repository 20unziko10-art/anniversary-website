# 🚀 Deploying the Anniversary Website

The app is a static site (Vite build → `/dist`). Any static host works. Below
are the three easiest paths. All the config files are already in this repo.

> **Tip:** Always test the *production* build locally first — it's dramatically
> faster than `npm run dev`:
> ```bash
> npm run build
> npm run preview   # opens a fast, production-identical preview
> ```

---

## Option 1 — Netlify (drag & drop, no account setup needed)

1. Run `npm run build` → produces the `dist/` folder.
2. Go to **https://app.netlify.com/drop**.
3. Drag the whole **`dist`** folder onto the page.
4. Done — you get a live URL in seconds. (`netlify.toml` + `public/_redirects`
   already handle routing and caching.)

**Or connect the repo** (auto-deploys on every push):
Netlify → Add new site → Import from Git → pick this repo. It auto-detects:
- Build command: `npm run build`
- Publish directory: `dist`

---

## Option 2 — Vercel

1. Push this project to GitHub/GitLab.
2. Go to **https://vercel.com/new**, import the repo.
3. Framework preset: **Vite** (auto-detected). Click Deploy.
   (`vercel.json` handles SPA routing + asset caching.)

Or via CLI:
```bash
npm i -g vercel
vercel          # follow prompts
vercel --prod   # promote to production
```

---

## Option 3 — GitHub Pages

GitHub Pages serves from a subpath (`/<repo-name>/`), so set the base first:

1. In `vite.config.js`, add `base: '/YOUR-REPO-NAME/'` to the config.
2. `npm run build`.
3. Publish the `dist` folder to the `gh-pages` branch, e.g.:
   ```bash
   npm i -D gh-pages
   npx gh-pages -d dist
   ```
4. Repo → Settings → Pages → Source: `gh-pages` branch.

> Note: GitHub Pages has no SPA fallback. Since visitors will land on `/`, the
> in-app navigation still works; only a hard refresh on `/universe` would 404.
> Netlify/Vercel don't have this limitation — prefer them if unsure.

---

## Before you go live

- [ ] Add real photos to `public/photos/` and set the `image` paths in `src/data/`.
- [ ] Set the real **wedding date** in `src/data/config.js` (drives the counter).
- [ ] Add `public/audio/piano.mp3` and `public/video/family.mp4` (or a video embed).
- [ ] `npm run build` and skim `npm run preview` once on your phone too.

Custom domain? Both Netlify and Vercel let you attach one for free in their
dashboard (Domain settings) — great for something like `momanddad.love`. 💛
