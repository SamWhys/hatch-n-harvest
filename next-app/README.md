# Hatch n Harvest — Next.js port

Pixel-perfect port of the Hatch n Harvest landing page to Next.js 15 (App Router, TypeScript, static export).

The original `index.html` at the repo root is left untouched. This subdirectory holds the Next.js source, and the static export lands in the repo's top-level `/docs/` folder.

## Stack

- Next.js 15 (App Router, static export)
- React 19
- TypeScript (strict mode)
- Vitest + Testing Library (smoke tests)
- No Tailwind, no design system — original CSS copied verbatim into `app/globals.css` to preserve pixel-perfect fidelity. Future iterations can refactor into Tailwind or a component library.

## Layout

```
next-app/
  app/
    layout.tsx        Root layout, <head> metadata, Google Fonts <link>
    page.tsx          Home page composes 9 section components
    globals.css       Original <style> block from index.html (verbatim)
  components/         Nav, Hero, Ticker, Manifesto, Work, Process, Studio, Contact, Footer
  public/
    assets/           Brand and work images (copied from /assets at repo root)
  scripts/
    postbuild.mjs     Moves Next's `out/` to `/docs/` and writes `.nojekyll`
  tests/
    smoke.test.tsx    8 smoke tests (render, sections, key copy, asset paths)
    setup.ts          Vitest setup (jest-dom matchers)
  next.config.ts      output:'export', basePath:'/hatch-n-harvest', trailingSlash:true, images.unoptimized
  tsconfig.json       Strict TS, "@/*" path alias
  vitest.config.ts    jsdom environment, React plugin
  package.json        Scripts: dev, build, start, typecheck, test
```

## Develop

```bash
cd next-app
npm install
npm run dev          # http://localhost:3000/hatch-n-harvest
```

## Build

```bash
cd next-app
npm run build        # local/preview build — basePath="/hatch-n-harvest"
npm run build:prod   # production build for custom domain (hatchnharvest.com) — no basePath
```

Use `build:prod` for any commit that updates `/docs/` for deploy. The default
`build` produces a basePath-prefixed bundle that works under
`username.github.io/hatch-n-harvest/`, but every asset will 404 on
hatchnharvest.com because the CNAME serves from the domain root.

## Test

```bash
cd next-app
npm test             # vitest run (8 smoke tests)
npm run typecheck    # tsc --noEmit
```

## Deploy (one-time, owner action)

Once this PR is merged, the repo owner (SamWhys) needs to switch GitHub Pages source:

1. Repo Settings → Pages
2. Build and deployment → Source: **Deploy from a branch**
3. Branch: **main** · Folder: **/docs**
4. Save

The original `index.html` at the repo root will no longer be served — `/docs/index.html` (Next.js build output) takes over at `https://samwhys.github.io/hatch-n-harvest/`.

## Notes

- `basePath: '/hatch-n-harvest'` matches the GitHub Pages subpath. Update if the repo is moved.
- `trailingSlash: true` makes the static export emit `/index.html` per route, which Pages serves cleanly.
- `images.unoptimized: true` is required for static export — Next.js Image optimization needs a server.
- Inline image src paths use `assets/...` (relative). With `trailingSlash: true`, the browser resolves these against the page URL, which works for the single-page site.
- Asset files in `public/assets/` are emitted to `/docs/assets/` at build time.
- `.nojekyll` is written to `/docs/` so GitHub Pages serves files starting with `_` (Next.js uses `_next/`).
