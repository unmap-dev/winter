import type { Lang } from "@/lib/kit/i18n";

/** Winter's own words. The block and the kit carry theirs. */
export const TEXT = {
  en: {
    lifts3d: "3D lifts",
    lifts3dHint: "Draw the picked ski area's lift cables in 3D on its terrain.",
    trees3d: "3D trees",
    trees3dHint: "Draw the woods as 3D trees on the terrain, near the camera, from zoom 13.5 in.",
  },
  fr: {
    lifts3d: "Remontées 3D",
    lifts3dHint: "Tracer en 3D, sur le relief, les câbles des remontées de la station choisie.",
    trees3d: "Arbres 3D",
    trees3dHint: "Dessiner les forêts en arbres 3D sur le relief, près de la caméra, à partir du zoom 13,5.",
  },
} satisfies Record<Lang, Record<string, string>>;
