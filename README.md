# Ski Area Explorer, built with Unmap

Every ski area in Canada on the `winter` style over 3D terrain: search by name, filter by
province or territory and by downhill or nordic, and pick an area for its vertical, top and base,
runs, lifts, the way its runs face and the drive time from the nearest city. Turn on **3D lifts**
to draw the picked area's lift cables on its terrain. Share a link to an area. One of the
[Unmap apps](https://unmap.dev/apps); live at
[apps.unmap.dev/winter](https://apps.unmap.dev/winter/).

The ski data is **real open data**: ski areas, runs and lifts from OpenStreetMap, served by
Unmap's Ski add-on under the Open Database Licence (ODbL), with elevations sampled from Unmap's
terrain and drive times from Unmap's routing (see [`DATA_SOURCES.md`](DATA_SOURCES.md)). The app
has no data of its own and invents none. The panel credits OpenStreetMap and the licence wherever
the data is on screen.

> Terrain information only, not avalanche or safety advice. There is no live lift, run or
> grooming status. Check the area's own conditions and the avalanche forecast before you go.

## The key it needs

A browser key **with the Ski add-on**. The list, the search, the area panel and the 3D lifts all
call `/ski/areas`, which answers `403 addon_required` to a key without it. On the dev plan the
add-on is free from `localhost` only; from your own domain it needs a paid
plan with the add-on ([pricing](https://unmap.dev/pricing)). A key without it still loads the
winter map in 3D, and the panel says why the ski areas are missing.

## Run it

You need Node 24 (22.18+ works), pnpm and an Unmap browser key from
[unmap.dev/dashboard](https://unmap.dev/dashboard).

```bash
cp .env.example .env.local      # then set NEXT_PUBLIC_UNMAP_KEY
pnpm install
pnpm dev                        # http://localhost:3209
```

Without a key the app says how to get one and calls nothing.

| Command | |
| --- | --- |
| `pnpm dev` | development server on port 3209 |
| `pnpm build` | static export in `out/` |
| `pnpm test` | unit and component tests (Vitest) |
| `pnpm lint` / `pnpm typecheck` | |
| `pnpm run deploy` | build, then `wrangler deploy` to your Cloudflare account (edit `wrangler.jsonc` first) |

The key ships in the browser bundle. Restrict it to your origins (`http://localhost:3209` and your
domain) in the dashboard. Any static host works: `out/` is plain files.

## Shareable links

| Query | |
| --- | --- |
| `?area=sunshine-village` | opens on that ski area, named by a slug of its name (an area id from `/ski/areas` also works) |
| `?lifts=3d` | 3D lifts on |
| `?lang=fr` | French |

## What it calls

- `GET /ski/areas` once on load and again when a filter changes (the search waits for a pause in
  typing). Picking an area makes no call: the list already holds it.
- With 3D lifts on, `GET /ski/areas/{id}/lifts-3d` once per area you pick. deck.gl is downloaded
  only then: with 3D lifts off it is never loaded. Turning 3D lifts on or off recreates the map,
  because antialiasing can only be chosen when the map is created.
- The map's own style, tile and terrain requests.

## How it is built

- `components/winter/winter-app.tsx`: the header (with the 3D lifts switch and the language
  switch), the URL state, and the `ski-resort-explorer` block filling the rest of the page.
- `lib/url.ts`: the shareable link, as pure functions.
- `components/ui/` and `lib/map-context.tsx`: the registry items (`ski-resort-explorer`, `map`,
  `map-context`) and stock shadcn primitives, copied in **unmodified**. `lib/kit/`: the shared app
  chrome. Change them upstream, never here; in the monorepo, `pnpm sync` recopies them and
  `test/sync.test.ts` fails on drift. In your own clone they are ordinary source: edit freely.

To use the block in an app you already have:

```bash
npx shadcn@latest registry add @unmap=https://registry.unmap.dev/r/{name}.json
npx shadcn@latest add @unmap/ski-resort-explorer
```

Guide: [unmap.dev/docs/ski](https://unmap.dev/docs/ski).

## Licence

The code is MIT. The ski data is © OpenStreetMap contributors under the ODbL: keep the credit
the panel shows, and see [`DATA_SOURCES.md`](DATA_SOURCES.md) for what that asks of you.
