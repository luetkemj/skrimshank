import { getLux } from "./lighting.system";

describe("getLux", () => {
  it("should work", () => {
    expect(getLux({ dist: 0, beam: 1, lumens: 1 })).toBe(1);
    expect(getLux({ dist: 10, beam: 10, lumens: 10 })).toBe(0);
    expect(getLux({ dist: 9, beam: 10, lumens: 100 })).toEqual(10);
    expect(getLux({ dist: 5, beam: 10, lumens: 100 })).toBe(50);
  });
});
