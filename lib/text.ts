import type { Lang } from "@/lib/kit/i18n";

/** Winter's own words. The block and the kit carry theirs. */
export const TEXT = {
  en: {
    lifts3d: "3D lifts",
    lifts3dHint: "Draw the picked ski area's lift cables in 3D on its terrain.",
  },
  fr: {
    lifts3d: "Remontées 3D",
    lifts3dHint: "Tracer en 3D, sur le relief, les câbles des remontées de la station choisie.",
  },
} satisfies Record<Lang, Record<string, string>>;
