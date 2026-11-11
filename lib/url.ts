/**
 * The shareable link: `?area=<slug>` (such as `?area=nakiska`) opens on that ski area and `?lifts=3d` turns 3D lifts on; other
 * keys (such as `lang`) are kept. Pure functions; the app owns history. Unit-tested in
 * test/url.test.ts.
 */

/**
 * A ski area's slug (the block's `areaSlug`: lower-case words joined by hyphens) or its id, which
 * has the same shape (`osm-relation-<n>`) and is what an area with no Latin name goes by.
 */
const AREA = /^[a-z0-9]+(?:-[a-z0-9]+){0,15}$/;

export interface WinterState {
  /** The ski area on screen, by its slug, or null for the whole country. */
  area: string | null;
  /** Whether the picked area's lifts are drawn in 3D. */
  lifts3d: boolean;
}

export function parseState(search: string): WinterState {
  const q = new URLSearchParams(search);
  const area = q.get("area");
  return { area: area && AREA.test(area) ? area : null, lifts3d: q.get("lifts") === "3d" };
}

export function writeState(search: string, state: WinterState): string {
  const q = new URLSearchParams(search);
  if (state.area) q.set("area", state.area);
  else q.delete("area");
  if (state.lifts3d) q.set("lifts", "3d");
  else q.delete("lifts");
  const s = q.toString();
  return s ? `?${s}` : "";
}
