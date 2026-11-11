import type { AppManifest } from "@/lib/kit/provenance";

/**
 * What the "Built with Unmap" panel and the header say about Winter. Lists only what the app really
 * calls; a service is added here in the same change that starts calling it.
 */
export const MANIFEST: AppManifest = {
  slug: "winter",
  name: { en: "Ski Area Explorer", fr: "Explorateur de stations de ski" },
  tagline: {
    en: "Every ski area in Canada on 3D terrain: vertical, runs, lifts, aspect and drive time, with lifts in 3D.",
    fr: "Toutes les stations de ski du Canada sur relief 3D : dénivelé, pistes, remontées, orientation et temps de route, avec remontées en 3D.",
  },
  services: [
    {
      name: "Maps",
      role: {
        en: "The winter style on 3D terrain, with the ski overlay of runs and lifts once the key holds the Ski add-on, labels in the page's language.",
        fr: "Le style hiver sur relief 3D, avec la superposition ski des pistes et des remontées quand la clé a le module complémentaire Ski, étiquettes dans la langue de la page.",
      },
      calls: ['<Map apiKey={key} style="winter" terrain overlays={["ski"]} lang={lang} />'],
      docs: "https://unmap.dev/docs/apis/maps",
    },
    {
      name: "Ski areas",
      role: {
        en: "The list, the search and the province and activity filters, and each area's vertical, runs, lifts, aspect and drive time from the nearest city. Needs the Ski add-on.",
        fr: "La liste, la recherche et les filtres par province et par activité, et pour chaque station son dénivelé, ses pistes, ses remontées, son orientation et le temps de route depuis la ville la plus proche. Nécessite le module complémentaire Ski.",
      },
      calls: ["new Ski({ key }).areas({ q, province, activity })  // GET /ski/areas"],
      docs: "https://unmap.dev/docs/ski",
    },
    {
      name: "Ski areas · 3D lifts",
      role: {
        en: "With 3D lifts on, the picked area's lift cables at heights baked from the same terrain release the map draws, drawn with deck.gl in the map's own WebGL context. Loaded only when asked for.",
        fr: "Avec les remontées 3D, les câbles des remontées de la station choisie, à des hauteurs tirées de la même version du relief que la carte, tracés avec deck.gl dans le contexte WebGL de la carte. Chargés seulement sur demande.",
      },
      calls: ["fetchLifts3d({ key, areaId })  // GET /ski/areas/{id}/lifts-3d", "createDeckOverlay(map, { layers: [liftCablesLayer(lifts, { exaggeration })] })"],
      docs: "https://unmap.dev/docs/ski#lift-geometry-in-3d",
    },
  ],
  items: ["ski-resort-explorer", "map"],
  provenance: [
    {
      kind: "live",
      label: {
        en: "Ski areas, runs, lifts and their 3D geometry, derived from OpenStreetMap",
        fr: "Stations de ski, pistes, remontées et leur géométrie 3D, tirées d'OpenStreetMap",
      },
      source: "Unmap Ski add-on, built from OpenStreetMap",
      licence: "Open Database Licence (ODbL)",
      attribution: "© OpenStreetMap contributors. Terrain information only, not avalanche or safety advice.",
      url: "https://www.openstreetmap.org/copyright",
    },
    {
      kind: "live",
      label: { en: "Basemap and 3D terrain", fr: "Carte de base et relief 3D" },
      source: "Unmap",
      attribution: "© unmap © OpenStreetMap contributors. Terrain: Mapterhorn and underlying suppliers",
    },
  ],
  source: "https://github.com/unmap-dev/winter",
};
