# Eric's Lab — iPhone app

A touch-first, **non-scrolling**, installable iPhone web app. This is a separate project from [ericoij.com](https://ericoij.com); no changes to the original website are required.

## What's in the first PR

- React + TypeScript + Vite app shell
- Fixed viewport, safe-area spacing, large touch targets, Home/Studio/Photos/Settings navigation
- Distinct screens for Studio, Photo Library, Family Tree, and Experiments
- Working theme switcher and interaction sketch; no imitation of the existing site's 808/audio or real photo data
- Standalone web app manifest, custom PNG icons, iOS Home Screen metadata, same-origin offline app shell
- GitHub Actions checks and basic PWA tests

**Not yet connected:** the existing 808 engine and photographs. Those remain in `ericoij.com`. This PR intentionally does **not** copy their implementation, embed the website, or invent a photo API. Later integrations should use a reviewed interface from the existing source.

## Run locally

```sh
npm install
npm run dev
npm test
npm run build
```

## Publish & install on an iPhone

1. Connect this repository to Vercel (framework preset: Vite; output: `dist`).
2. Deploy over HTTPS; optionally assign `app.ericoij.com` after configuring DNS.
3. On iPhone, open the deployed URL in **Safari**.
4. Tap **Share → Add to Home Screen**, enable **Open as Web App**, and tap **Add**.
5. Launch **Eric's Lab** from its icon. The application itself does not scroll; each module is its own screen.

The app is not live just because a GitHub pull request exists. You must merge and deploy it first.

## Layout & offline behavior

The app uses an intentionally fixed viewport (including iOS safe areas), and smaller-height screens compress the interface. A basic service worker caches same-origin build assets and an offline navigation shell. It **does not** attempt to cache gallery photos, authenticated content, or third-party data. The PWA requires HTTPS outside localhost.

## Architecture

```text
ericoij.com          Existing website; canonical 808 and photo library
ericoij-phoneapp     Mobile-first app shell; independent deployment
```

No cross-repository code synchronization has been configured yet.
