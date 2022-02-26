import _ from "lodash";

export const grid = {
  width: 100,
  height: 44,

  // legend: {
  //   name: "legend",
  //   width: 12,
  //   height: 41,
  //   x: 0,
  //   y: 0,
  //   halfWidth: true,
  // },

  fps: {
    name: "fps",
    width: 12,
    height: 1,
    x: 0,
    y: 42,
    halfWidth: true,
  },

  build: {
    name: "build",
    width: 12,
    height: 1,
    x: 0,
    y: 43,
    halfWidth: true,
  },

  mapOverlay: {
    name: "mapOverlay",
    width: 87,
    height: 39,
    x: 13,
    y: 3,
    halfWidth: false,
  },

  map: {
    name: "map",
    width: 87,
    height: 39,
    x: 13,
    y: 3,
    halfWidth: false,
  },

  // withinReach: {
  //   name: "withinReach",
  //   width: 3,
  //   height: 3,
  //   x: 97,
  //   y: 0,
  //   halfWidth: false,
  // },

  // withinReachBelow: {
  //   name: "withinReachBelow",
  //   width: 3,
  //   height: 3,
  //   x: 97,
  //   y: 0,
  //   halfWidth: false,
  // },

  adventureLog: {
    name: "adventureLog",
    width: 84,
    height: 3,
    x: 13,
    y: 0,
    halfWidth: true,
  },

  ambiance: {
    name: "ambiance",
    width: 87,
    height: 1,
    x: 13,
    y: 42,
    halfWidth: true,
  },

  contextMenu: {
    name: "contextMenu",
    width: 87,
    height: 1,
    x: 13,
    y: 43,
    halfWidth: true,
  },

  float: {
    name: "float",
    width: 40,
    height: 39,
    x: 13,
    y: 3,
    halfWidth: true,
  },

  // menu: {
  //   name: "menu",
  //   width: 87,
  //   height: 41,
  //   x: 13,
  //   y: 3,
  //   halfWidth: true,
  // },
};

export const CARDINAL = [
  { x: 0, y: -1 }, // N
  { x: 1, y: 0 }, // E
  { x: 0, y: 1 }, // S
  { x: -1, y: 0 }, // W
];

export const DIAGONAL = [
  { x: 1, y: -1 }, // NE
  { x: 1, y: 1 }, // SE
  { x: -1, y: 1 }, // SW
  { x: -1, y: -1 }, // NW
];

export const ALL = [...CARDINAL, ...DIAGONAL];

export const toCell = (cellOrId) => {
  let cell = cellOrId;
  if (typeof cell === "string") cell = idToCell(cell);

  return cell;
};

export const toLocId = (cellOrId) => {
  let locId = cellOrId;
  if (typeof locId !== "string") locId = cellToId(locId);

  return locId;
};

const insideCircle = (center, tile, radius) => {
  const dx = center.x - tile.x;
  const dy = center.y - tile.y;
  const distance_squared = dx * dx + dy * dy;
  return distance_squared <= radius * radius;
};

export const circle = (center, radius) => {
  const diameter = radius % 1 ? radius * 2 : radius * 2 + 1;
  const top = center.y - radius;
  const bottom = center.y + radius;
  const left = center.x - radius;
  const right = center.x + radius;

  const locsIds = [];

  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      const cx = Math.ceil(x);
      const cy = Math.ceil(y);
      if (insideCircle(center, { x: cx, y: cy }, radius)) {
        locsIds.push(`${cx},${cy}`);
      }
    }
  }

  return locsIds;
};

const lerp = (start, end, t) => {
  return start + t * (end - start);
};

const lerpPoint = (p0, p1, t) => {
  return { x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t) };
};

const diagonalDistance = (p0, p1) => {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
};

const roundPoint = (p) => {
  return { x: Math.round(p.x), y: Math.round(p.y) };
};

export const line = (cellOrId1, cellOrId2) => {
  const p0 = toCell(cellOrId1);
  const p1 = toCell(cellOrId2);

  let points = [];
  let N = diagonalDistance(p0, p1);
  for (let step = 0; step <= N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    points.push(roundPoint(lerpPoint(p0, p1, t)));
  }
  return points;
};

export const rectangle = ({ x, y, width, height, hasWalls }, tileProps) => {
  const tiles = {};

  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  if (hasWalls) {
    for (let yi = y1 + 1; yi < y2 - 1; yi++) {
      for (let xi = x1 + 1; xi < x2 - 1; xi++) {
        tiles[`${xi},${yi}`] = { x: xi, y: yi, ...tileProps };
      }
    }
  } else {
    for (let yi = y1; yi < y2; yi++) {
      for (let xi = x1; xi < x2; xi++) {
        tiles[`${xi},${yi}`] = { x: xi, y: yi, ...tileProps };
      }
    }
  }

  const center = {
    x: Math.round((x1 + x2) / 2),
    y: Math.round((y1 + y2) / 2),
  };

  return { x1, x2, y1, y2, center, hasWalls, tiles };
};

export const rectsIntersect = (rect1, rect2) => {
  return (
    rect1.x1 <= rect2.x2 &&
    rect1.x2 >= rect2.x1 &&
    rect1.y1 <= rect2.y2 &&
    rect1.y2 >= rect2.y1
  );
};

export const distance = (cell1, cell2) => {
  const x = Math.pow(cell2.x - cell1.x, 2);
  const y = Math.pow(cell2.y - cell1.y, 2);
  return Math.floor(Math.sqrt(x + y));
};

export const idToCell = (id) => {
  const coords = id.split(",");
  return {
    x: parseInt(coords[0], 10),
    y: parseInt(coords[1], 10),
    z: parseInt(coords[2], 10),
  };
};

export const cellToId = ({ x, y, z }) => `${x},${y},${z}`;

export const isOnMapEdge = (x, y) => {
  const { width, height, x: mapX, y: mapY } = grid.map;

  if (x === mapX) return true; // west edge
  if (y === mapY) return true; // north edge
  if (x === mapX + width - 1) return true; // east edge
  if (y === mapY + height - 1) return true; // south edge
  return false;
};

export const getNeighbors = ({ x, y, z }, direction = CARDINAL) => {
  const points = [];
  for (let dir of direction) {
    let candidate = {
      x: x + dir.x,
      y: y + dir.y,
      z,
    };
    if (
      candidate.x >= 0 &&
      candidate.x < grid.width &&
      candidate.y >= 0 &&
      candidate.y < grid.height
    ) {
      points.push(candidate);
    }
  }
  return points;
};

export const getNeighborIds = (cellOrId, direction = "CARDINAL") => {
  let cell = toCell(cellOrId);

  if (direction === "CARDINAL") {
    return getNeighbors(cell, CARDINAL).map(cellToId);
  }

  if (direction === "DIAGONAL") {
    return getNeighbors(cell, DIAGONAL).map(cellToId);
  }

  if (direction === "ALL") {
    return [
      ...getNeighbors(cell, CARDINAL).map(cellToId),
      ...getNeighbors(cell, DIAGONAL).map(cellToId),
    ];
  }
};

export const isNeighbor = (cell1, cell2) => {
  const c1 = toCell(cell1);
  const c2 = toCell(cell2);

  if (c1.z !== c2.z) {
    return false;
  }

  const { x: ax, y: ay } = c1;
  const { x: bx, y: by } = c2;

  if (
    (ax - bx === 1 && ay - by === 0) ||
    (ax - bx === 0 && ay - by === -1) ||
    (ax - bx === -1 && ay - by === 0) ||
    (ax - bx === 0 && ay - by === 1)
  ) {
    return true;
  }

  return false;
};

export const randomNeighbor = (cellOrId) => {
  const cell = toCell(cellOrId);
  const direction = _.sample(CARDINAL);
  const x = cell.x + direction.x;
  const y = cell.y + direction.y;
  return { x, y, z: cell.z };
};

export const getNeighbor = (cellOrId, dir) => {
  const cell = toCell(cellOrId);
  const dirMap = { N: 0, E: 1, S: 2, W: 3, NE: 4, SE: 5, SW: 6, NW: 7 };
  const direction = ALL[dirMap[dir]];
  return {
    x: cell.x + direction.x,
    y: cell.y + direction.y,
    z: cell.z,
  };
};

export const getDirection = (to, from) => {
  const cellA = toCell(to);
  const cellB = toCell(from);

  const { x: ax, y: ay } = cellA;
  const { x: bx, y: by } = cellB;

  let dir;

  if (ax - bx === -1 && ay - by === -1) dir = "NW";
  if (ax - bx === 1 && ay - by === -1) dir = "NE";
  if (ax - bx === 1 && ay - by === 1) dir = "SE";
  if (ax - bx === -1 && ay - by === 1) dir = "SW";

  if (ax - bx === 1 && ay - by === 0) dir = "E";
  if (ax - bx === 0 && ay - by === -1) dir = "N";
  if (ax - bx === -1 && ay - by === 0) dir = "W";
  if (ax - bx === 0 && ay - by === 1) dir = "S";

  if (ax - bx === 0 && ay - by === 0) dir = "X";

  return { dir, x: ax - bx, y: ay - by };
};

export const getVelocity = (a, b) => {
  const cellA = toCell(a);
  const cellB = toCell(b);

  const { x: ax, y: ay } = cellA;
  const { x: bx, y: by } = cellB;

  const velocity = { x: ax - bx, y: ay - by };

  return velocity;
};
