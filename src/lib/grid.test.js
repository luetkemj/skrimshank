import * as grid from "./grid";

describe("grid", () => {
  it("should exist", () => {
    expect(grid).toBeDefined();
  });
});

describe("toCell", () => {
  it("should work with locIds", () => {
    expect(grid.toCell("1,2,3")).toEqual({ x: 1, y: 2, z: 3 });
  });

  it("should work with cells", () => {
    expect(grid.toCell({ x: 1, y: 2, z: 3 })).toEqual({ x: 1, y: 2, z: 3 });
  });
});

describe("toLocId", () => {
  it("should work with locIds", () => {
    expect(grid.toLocId("1,2,3")).toEqual("1,2,3");
  });

  it("should work with cells", () => {
    expect(grid.toLocId({ x: 1, y: 2, z: 3 })).toEqual("1,2,3");
  });
});

describe("getNeighbors", () => {
  it("should work for CARDINAL", () => {
    expect(grid.getNeighbors({ x: 1, y: 1, z: 2 }, grid.CARDINAL)).toEqual([
      {
        x: 1,
        y: 0,
        z: 2,
      },
      {
        x: 2,
        y: 1,
        z: 2,
      },
      {
        x: 1,
        y: 2,
        z: 2,
      },
      {
        x: 0,
        y: 1,
        z: 2,
      },
    ]);
  });

  it("should work for DIAGONAL", () => {
    expect(grid.getNeighbors({ x: 1, y: 1 }, grid.DIAGONAL)).toEqual([
      {
        x: 2,
        y: 0,
      },
      {
        x: 2,
        y: 2,
      },
      {
        x: 0,
        y: 2,
      },
      {
        x: 0,
        y: 0,
      },
    ]);
  });
});

describe("getNeighborIds", () => {
  it("should work for ALL", () => {
    expect(grid.getNeighborIds("1,1,1", "ALL")).toEqual([
      "1,0,1",
      "2,1,1",
      "1,2,1",
      "0,1,1",
      "2,0,1",
      "2,2,1",
      "0,2,1",
      "0,0,1",
    ]);
  });

  it("should work for DIAGONAL", () => {
    expect(grid.getNeighborIds("1,1,1", "DIAGONAL")).toEqual([
      "2,0,1",
      "2,2,1",
      "0,2,1",
      "0,0,1",
    ]);
  });

  it("should work for CARDINAL", () => {
    expect(grid.getNeighborIds("1,1,1", "CARDINAL")).toEqual([
      "1,0,1",
      "2,1,1",
      "1,2,1",
      "0,1,1",
    ]);
  });
});

describe("isNeighbor", () => {
  it("should work when inputs are neighbors", () => {
    expect(grid.isNeighbor("0,0,0", "0,1,0")).toBe(true);
  });

  it("should work when inputs are not neighbors", () => {
    expect(grid.isNeighbor("0,0,0", "0,5,0")).toBe(false);
  });

  it("should work with mixed inputs", () => {
    expect(grid.isNeighbor({ x: 0, y: 0, z: 0 }, "0,1,0")).toBe(true);
  });

  it("should return false if not on the same z level", () => {
    expect(grid.isNeighbor("0,1,1", "0,1,0")).toBe(false);
  });

  it("should return false if passed the same cells", () => {
    expect(grid.isNeighbor("0,1,1", "0,1,1")).toBe(false);
  });
});

describe("randomNeighbor", () => {
  it("should work with a cell", () => {
    const cell1 = { x: 0, y: 0, z: 0 };
    // const locId1 = "0,0,0";
    expect(grid.isNeighbor(cell1, grid.randomNeighbor(cell1))).toBe(true);
  });

  it("should work with a cell", () => {
    const cell1 = { x: 0, y: 0, z: 0 };
    const locId1 = "0,0,0";
    expect(grid.isNeighbor(cell1, grid.randomNeighbor(locId1))).toBe(true);
  });
});

describe("getNeighbor", () => {
  const locId = "0,0,0";
  it("should work N", () => {
    expect(grid.getNeighbor(locId, "N")).toEqual({ x: 0, y: -1, z: 0 });
  });
  it("should work S", () => {
    expect(grid.getNeighbor(locId, "S")).toEqual({ x: 0, y: 1, z: 0 });
  });
  it("should work E", () => {
    expect(grid.getNeighbor(locId, "E")).toEqual({ x: 1, y: 0, z: 0 });
  });
  it("should work W", () => {
    expect(grid.getNeighbor(locId, "W")).toEqual({ x: -1, y: 0, z: 0 });
  });
  it("should work NE", () => {
    expect(grid.getNeighbor(locId, "NE")).toEqual({ x: 1, y: -1, z: 0 });
  });
  it("should work SE", () => {
    expect(grid.getNeighbor(locId, "SE")).toEqual({ x: 1, y: 1, z: 0 });
  });
  it("should work SW", () => {
    expect(grid.getNeighbor(locId, "SW")).toEqual({ x: -1, y: 1, z: 0 });
  });
  it("should work NW", () => {
    expect(grid.getNeighbor(locId, "NW")).toEqual({ x: -1, y: -1, z: 0 });
  });
});

describe("circle", () => {
  it("should work for whole radii", () => {
    expect(grid.circle({ x: 3, y: 3 }, 2)).toEqual([
      "3,1",
      "2,2",
      "3,2",
      "4,2",
      "1,3",
      "2,3",
      "3,3",
      "4,3",
      "5,3",
      "2,4",
      "3,4",
      "4,4",
      "3,5",
    ]);
  });

  it("should work for half radii", () => {
    expect(grid.circle({ x: 3, y: 3 }, 2.5)).toEqual([
      "2,1",
      "3,1",
      "4,1",
      "1,2",
      "2,2",
      "3,2",
      "4,2",
      "5,2",
      "1,3",
      "2,3",
      "3,3",
      "4,3",
      "5,3",
      "1,4",
      "2,4",
      "3,4",
      "4,4",
      "5,4",
      "2,5",
      "3,5",
      "4,5",
    ]);
  });

  it("should work anywhere", () => {
    expect(grid.circle({ x: 40, y: 40 }, 2.5)).toEqual([
      "39,38",
      "40,38",
      "41,38",
      "38,39",
      "39,39",
      "40,39",
      "41,39",
      "42,39",
      "38,40",
      "39,40",
      "40,40",
      "41,40",
      "42,40",
      "38,41",
      "39,41",
      "40,41",
      "41,41",
      "42,41",
      "39,42",
      "40,42",
      "41,42",
    ]);
  });
});
