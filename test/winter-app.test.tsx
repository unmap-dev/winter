// @vitest-environment jsdom
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";

type Props = Record<string, unknown>;

const mocks = vi.hoisted(() => ({
  key: "um_test_winter",
  areas: vi.fn(),
  skiOptions: [] as unknown[],
  map: null as unknown,
  props: {} as Record<string, Props | undefined>,
}));

vi.mock("@/lib/kit/config", async (orig) => ({
  ...(await orig<typeof import("@/lib/kit/config")>()),
  get API_KEY() {
    return mocks.key;
  },
  GATEWAY: "https://api.test",
}));
// The SDK: the block's one client. Nothing reaches the network.
vi.mock("@unmap/sdk", () => ({
  Ski: class {
    constructor(options: unknown) {
      mocks.skiOptions.push(options);
    }
    areas = mocks.areas;
  },
}));
// The map item and its context are tested in apps/registry; here they only record what they get.
vi.mock("@/components/ui/map", () => ({
  Map: (props: Props) => {
    mocks.props.map = props;
    return <div data-testid="map">{props.children as ReactNode}</div>;
  },
}));
vi.mock("@/lib/map-context", () => ({ useMap: () => mocks.map, useMapReady: () => true }));
// deck.gl, at the block's dynamic-import boundary.
const deck = vi.hoisted(() => ({ fetchLifts3d: vi.fn(), overlays: [] as Array<{ remove: () => void }> }));
vi.mock("@unmap/deck", () => ({
  fetchLifts3d: deck.fetchLifts3d,
  liftCablesLayer: (lifts: unknown, options?: { id?: string }) => ({ id: options?.id ?? "unmap-lift-cables", lifts }),
  LIFT_COLORS: { default: [66, 66, 66, 255] },
  createDeckOverlay: () => {
    const overlay = { remove: vi.fn() };
    deck.overlays.push(overlay);
    return overlay;
  },
}));

import { WinterApp } from "../components/winter/winter-app";

const AREA = {
  id: "osm-way-474288286",
  name: "Sunshine Village",
  province: "AB",
  locality: "Banff",
  location: [-115.78, 51.08],
  base: [-115.76, 51.11],
  bbox: [-115.82, 51.06, -115.75, 51.12],
  activities: ["downhill"],
  status: "operating",
  websites: ["https://www.skibanff.com/"],
  wikidata_id: null,
  elevation: { top_m: 2730, base_m: 1660, vertical_m: 1070 },
  runs: { count: 137, downhill_km: 60.2, nordic_km: 0 },
  lifts: { count: 12 },
  aspect: { n: 0.4, ne: 0.2, e: 0.1, se: 0, s: 0, sw: 0, w: 0.1, nw: 0.2 },
  drive: { from: "Calgary", minutes: 95 },
  source: "OpenStreetMap",
  licence: "ODbL-1.0",
};
const OTHER = { ...AREA, id: "osm-relation-7", name: "Mont Tremblant", province: "QC", locality: "Mont-Tremblant" };
const answer = (data: unknown[]) => ({ data, meta: { attribution: "© OpenStreetMap contributors", status: "current", unmap_updated_at: "now" } });

async function open(search = "") {
  window.history.replaceState(null, "", `/${search}`);
  await act(async () => {
    render(<WinterApp />);
  });
  await act(async () => {});
}

beforeEach(() => {
  mocks.key = "um_test_winter";
  mocks.areas.mockReset();
  mocks.areas.mockResolvedValue(answer([AREA, OTHER]));
  mocks.skiOptions.length = 0;
  mocks.map = {
    cameraForBounds: vi.fn(() => ({ center: [-122.95, 50.1], zoom: 12 })),
    flyTo: vi.fn(),
    jumpTo: vi.fn(),
    getTerrain: () => ({ exaggeration: 1 }),
    getContainer: () => ({ getBoundingClientRect: () => ({ left: 0, top: 0, right: 400, bottom: 800, width: 400, height: 800 }) }),
  };
  mocks.props = {};
  deck.fetchLifts3d.mockReset();
  deck.fetchLifts3d.mockResolvedValue({ area_id: AREA.id, lifts: [] });
  deck.overlays.length = 0;
});
afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

describe("Winter", () => {
  it("opens on all of Canada, on the winter style in 3D with the ski overlay, and credits OpenStreetMap", async () => {
    await open();
    expect(screen.getByRole("heading", { name: "Ski Area Explorer" })).toBeTruthy();
    expect(mocks.skiOptions.at(-1)).toEqual({ key: "um_test_winter", gateway: "https://api.test" });
    expect(mocks.props.map).toMatchObject({ style: "winter", terrain: true, overlays: ["ski"], center: [-100, 56], zoom: 3, lang: "en" });
    expect(mocks.props.map).toMatchObject({ maplibre: { maxPitch: 85 } });
    const credits = screen.getByTestId("ski-credits");
    expect(within(credits).getByRole("link", { name: "Ski data © OpenStreetMap contributors" }).getAttribute("href")).toBe("https://www.openstreetmap.org/copyright");
    expect(credits.textContent).toContain("Open Database Licence (ODbL)");
    expect(credits.textContent).toContain("Terrain information only, not avalanche or safety advice.");
  });

  it("opens the area a shared link names, by its slug", async () => {
    await open("?area=sunshine-village");
    const panel = within(screen.getByRole("region", { name: "Selected ski area" }));
    expect(panel.getByRole("heading", { name: "Sunshine Village" })).toBeTruthy();
    expect(panel.getByText("1 h 35 min from Calgary")).toBeTruthy();
  });

  it("opens an area a link names by its id", async () => {
    await open("?area=osm-way-474288286");
    expect(within(screen.getByRole("region", { name: "Selected ski area" })).getByRole("heading", { name: "Sunshine Village" })).toBeTruthy();
  });

  it("keeps the picked area in the URL, and drops it when the area closes", async () => {
    await open("?lang=fr");
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /Mont Tremblant/ })));
    expect(window.location.search).toBe("?lang=fr&area=mont-tremblant");
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Retour à toutes les stations" })));
    expect(window.location.search).toBe("?lang=fr");
  });

  it("turns 3D lifts on from the header: antialiased map, the cables of the picked area, and a link that keeps it", async () => {
    await open("?area=sunshine-village");
    const toggle = screen.getByRole("button", { name: "3D lifts" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(deck.fetchLifts3d).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(toggle));
    await act(async () => {});
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(window.location.search).toBe("?area=sunshine-village&lifts=3d");
    expect(mocks.props.map).toMatchObject({ maplibre: { canvasContextAttributes: { antialias: true } } });
    expect(deck.fetchLifts3d).toHaveBeenCalledWith(expect.objectContaining({ key: "um_test_winter", areaId: "osm-way-474288286", gateway: "https://api.test" }));
    expect(deck.overlays).toHaveLength(1);

    await act(async () => fireEvent.click(toggle));
    expect(deck.overlays[0]!.remove).toHaveBeenCalled();
    expect(window.location.search).toBe("?area=sunshine-village");
  });

  it("opens with 3D lifts on from a link", async () => {
    await open("?area=osm-way-474288286&lifts=3d");
    expect(screen.getByRole("button", { name: "3D lifts" }).getAttribute("aria-pressed")).toBe("true");
    expect(deck.overlays).toHaveLength(1);
  });

  it("explains a key without the Ski add-on instead of failing", async () => {
    mocks.areas.mockRejectedValueOnce({ status: 403, code: "addon_required", addon: "addon-ski" });
    await open("?area=osm-way-474288286");
    expect(document.querySelector("[data-unmap-addon-gate]")!.getAttribute("data-unmap-addon-gate")).toBe("addon_required");
    expect(screen.getByText("Ski areas need the Ski add-on")).toBeTruthy();
    expect(mocks.props.map).toMatchObject({ style: "winter", terrain: true });
  });

  it("speaks French with ?lang=fr, the toggle and the map labels included", async () => {
    await open("?lang=fr");
    expect(screen.getByRole("heading", { name: "Explorateur de stations de ski" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Remontées 3D" })).toBeTruthy();
    expect(mocks.props.map).toMatchObject({ lang: "fr" });
    expect(screen.getByTestId("ski-credits").textContent).toContain("pas un avis sur les avalanches");
  });

  it("asks for a key and calls nothing without one", async () => {
    mocks.key = "";
    await open();
    expect(screen.getByText("This app needs an Unmap API key")).toBeTruthy();
    expect(mocks.areas).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "3D lifts" })).toBeNull();
  });
});
