# Features

What the Ski Area Explorer does, which Unmap API does it, and what it deliberately does not do.

## Implemented

| Feature | How | Unmap |
| --- | --- | --- |
| All of Canada on 3D terrain | registry `map` on the `winter` style with terrain, opening on the whole country; the `ski` overlay of runs and lifts once the key holds the Ski add-on | Maps API (`/styles/winter.json?terrain=on&overlays=ski`, `/tiles`, `/terrain`) |
| Ski area list | every ski area, with its place and vertical | Ski (`GET /ski/areas`) |
| Search | by name, accents and case ignored, after a pause in typing | Ski (`?q=`) |
| Province and activity filters | a province or territory; downhill, nordic or both | Ski (`?province=`, `?activity=`) |
| Area page | picking an area flies to it and tilts the camera onto its terrain; the panel shows vertical, top and base, runs (count, downhill and nordic km), lifts, an eight-direction aspect readout, the drive time from the nearest city, and its websites | — (the list already holds it) |
| 3D lifts | the header's "3D lifts" switch draws the picked area's lift cables at heights baked from the terrain release, with deck.gl in the map's own WebGL context; deck.gl is loaded only when it is on | Ski (`GET /ski/areas/{id}/lifts-3d`) |
| Shareable link | `?area=<id>`, `?lifts=3d` and `?lang=fr` | — |
| Credits and disclaimer | OpenStreetMap and the ODbL credited in the panel, with "terrain information only, not avalanche or safety advice", always visible | — |
| Add-on gate | a key without the Ski add-on keeps the 3D winter map, and the panel says why and links pricing; dev-plan origin and allowance limits are told apart | Ski (`403 addon_required`, `dev_only`, `usage_limit_reached`) |
| Errors | a failed search or 3D lifts load is shown where its answer would have been, in en/fr, with a retry | — |
| English and French | the header switch; map labels, province names and numbers follow | Maps `lang` |
| No-key state | explains how to get a key; never calls the API without one | — |
| Built with Unmap | the services, calls, components and data sources behind the page | — |
| No tracking | no analytics, no cookies, nothing stored | — |

## Not yet

- 3D lift models (pylons, chairs, cabins): the lifts are drawn as cables only.
- An elevation profile of a run.

## Not goals

Live lift, run, grooming or snow status; avalanche danger, ATES or any safety guidance; route
recommendations; ski areas outside Canada.
