import { describe, expect, it } from "vitest";
import { parseState, writeState } from "@/lib/url";

describe("the shareable link", () => {
  it("reads the area and the 3D lifts switch", () => {
    expect(parseState("?area=nakiska")).toEqual({ area: "nakiska", lifts3d: false, trees3d: false });
    expect(parseState("?area=fortress-mountain-resort-w909322254").area).toBe("fortress-mountain-resort-w909322254");
    // An area with no Latin name goes by its id, which a link may also give.
    expect(parseState("?area=osm-way-474288286")).toEqual({ area: "osm-way-474288286", lifts3d: false, trees3d: false });
    expect(parseState("?area=osm-relation-12&lifts=3d&lang=fr")).toEqual({ area: "osm-relation-12", lifts3d: true, trees3d: false });
    expect(parseState("")).toEqual({ area: null, lifts3d: false, trees3d: false });
  });

  it("ignores an area that is not a slug or an id", () => {
    expect(parseState("?area=javascript:alert(1)").area).toBeNull();
    expect(parseState("?area=osm-way-").area).toBeNull();
    expect(parseState("?area=Whistler Blackcomb").area).toBeNull();
    expect(parseState("?area=-nakiska").area).toBeNull();
    expect(parseState("?lifts=yes").lifts3d).toBe(false);
    expect(parseState("?trees=yes").trees3d).toBe(false);
  });

  it("reads and writes the 3D trees switch", () => {
    expect(parseState("?trees=3d").trees3d).toBe(true);
    expect(parseState("?area=nakiska&lifts=3d&trees=3d")).toEqual({ area: "nakiska", lifts3d: true, trees3d: true });
    expect(writeState("?lang=fr", { area: null, lifts3d: false, trees3d: true })).toBe("?lang=fr&trees=3d");
    expect(writeState("?trees=3d", { area: null, lifts3d: false, trees3d: false })).toBe("");
  });

  it("writes the state and keeps every other key", () => {
    expect(writeState("?lang=fr", { area: "nakiska", lifts3d: true, trees3d: false })).toBe("?lang=fr&area=nakiska&lifts=3d");
    expect(writeState("?lang=fr&area=osm-way-1&lifts=3d", { area: null, lifts3d: false, trees3d: false })).toBe("?lang=fr");
    expect(writeState("", { area: null, lifts3d: false, trees3d: false })).toBe("");
  });
});
