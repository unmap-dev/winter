# Data sources

Everything on screen is a live Unmap response. The app ships no data file and no sample data.

| What | Where it comes from | Licence | Credit shown |
| --- | --- | --- | --- |
| Ski areas, runs and lifts: names, places, activities, status, websites, run and lift counts and lengths | OpenStreetMap, built into an immutable ski release by Unmap's Ski add-on (`/ski/areas`, and the `ski` overlay on the map) | Open Database Licence (ODbL) 1.0 | "Ski data © OpenStreetMap contributors, Open Database Licence (ODbL)", in the panel, linked to openstreetmap.org/copyright and the licence |
| Top, base and vertical; the aspect of the runs | Sampled at build time from Unmap's terrain release, the same DEM the map's 3D terrain draws | Derived from the OpenStreetMap geometry above, so ODbL; terrain credited with the basemap | as above |
| 3D lifts: stations, pylons and cable heights | `/ski/areas/{id}/lifts-3d`: OpenStreetMap lift geometry with heights baked from the terrain release each file names (`terrain_release`) | ODbL | as above |
| Drive time from the nearest city | Computed at build time with Unmap's routing (`/matrix`, OpenStreetMap roads) from the nearest of the three closest census metropolitan areas of 100,000 or more; empty when none is within reach | ODbL (roads), Statistics Canada (city list) | as above |
| Basemap and 3D terrain | Unmap's `winter` style, vector tiles and terrain | © unmap © OpenStreetMap contributors; terrain from Mapterhorn and its suppliers | MapLibre's attribution control on the map |

## What the ODbL asks of you

The ski data is a derived database of OpenStreetMap. If you show it, keep the credit visible
where it is seen (the block does). If you publish a database derived from it, it has to be under
the ODbL too. Unmap keeps the OSM-derived layer separable from everything else for this reason.

## What is not here

- **No live status.** Lifts, runs and grooming are as mapped in OpenStreetMap, not as they are
  today. A run on the map is not necessarily open.
- **No avalanche or safety information**, and no ratings or route advice of any kind.
- **Coverage follows OpenStreetMap.** A small hill nobody has mapped is not in the list, and an
  area mapped without lifts or runs has no elevation numbers ("Not sampled").
- **Ski areas in Canada only.**

Gaps are shown as gaps: a missing number says so, and the app never fills one in.
