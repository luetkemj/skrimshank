import { each, filter, random, times } from "lodash";
import { line, rectangle, rectsIntersect, toPosid } from "../lib/grid";

function digHorizontalPassage(x1, x2, y) {
  const tiles = {};
  const start = Math.min(x1, x2);
  const end = Math.max(x1, x2) + 1;
  let x = start;

  while (x < end) {
    tiles[`${x},${y}`] = { x, y, sprite: "FLOOR" };
    x++;
  }

  return tiles;
}

function digVerticalPassage(y1, y2, x) {
  const tiles = {};
  const start = Math.min(y1, y2);
  const end = Math.max(y1, y2) + 1;
  let y = start;

  while (y < end) {
    tiles[`${x},${y}`] = { x, y, sprite: "FLOOR" };
    y++;
  }

  return tiles;
}

export const buildDungeon = ({
  x,
  y,
  width,
  height,
  minRoomSize = 6,
  maxRoomSize = 12,
  maxRoomCount = 30,
}) => {
  // fill the entire space with walls so we can dig it out later
  const dungeon = rectangle(
    { x, y, width, height },
    {
      sprite: "WALL",
    }
  );

  // setup dTiles and add DIRT tag
  dungeon.dTiles = { ...dungeon.tiles };
  each(dungeon.dTiles, (val, key) => {
    dungeon.dTiles[key].tags = [];
    dungeon.dTiles[key].tags.push("DIRT");
  });

  const rooms = [];
  let roomTiles = {};

  times(maxRoomCount, () => {
    let rw = random(minRoomSize, maxRoomSize);
    let rh = random(minRoomSize, maxRoomSize);
    let rx = random(x, width + x - rw - 1);
    let ry = random(y, height + y - rh - 1);

    // create a candidate room
    const candidate = rectangle(
      { x: rx, y: ry, width: rw, height: rh, hasWalls: true },
      { sprite: "FLOOR" }
    );

    // test if candidate is overlapping with any existing rooms
    if (!rooms.some((room) => rectsIntersect(room, candidate))) {
      rooms.push(candidate);
      roomTiles = { ...roomTiles, ...candidate.tiles };
    }
  });

  // add room tags
  each(roomTiles, (val, key) => {
    dungeon.dTiles[key].tags.push("ROOM");
    dungeon.dTiles[key].tags.push("FLOOR");
  });

  let prevRoom = null;
  let passageTiles;

  for (let room of rooms) {
    if (prevRoom) {
      const prev = prevRoom.center;
      const curr = room.center;

      passageTiles = {
        ...passageTiles,
        ...digHorizontalPassage(prev.x, curr.x, curr.y),
        ...digVerticalPassage(prev.y, curr.y, prev.x),
      };
    }

    prevRoom = room;
  }

  dungeon.rooms = rooms;

  dungeon.tiles = { ...dungeon.tiles, ...roomTiles, ...passageTiles };

  // get perimeter walls for each room
  const addPerimeterTags = (cell) => {
    const posid = `${cell.x},${cell.y}`;
    if (dungeon.dTiles[posid]) {
      dungeon.dTiles[posid].tags.push("WALL");
      dungeon.dTiles[posid].tags.push("PERIMETER");
    }
  };
  each(rooms, (room) => {
    const sw = { x: room.x1, y: room.y2 - 1 }; // sw
    const se = { x: room.x2 - 1, y: room.y2 - 1 }; // se
    const nw = { x: room.x1, y: room.y1 };
    const ne = { x: room.x2 - 1, y: room.y1 };

    line(nw, ne).forEach(addPerimeterTags);
    line(ne, se).forEach(addPerimeterTags);
    line(se, sw).forEach(addPerimeterTags);
    line(sw, nw).forEach(addPerimeterTags);
  });

  // add passage tags
  each(passageTiles, (val, key) => {
    dungeon.dTiles[key].tags.push("PASSAGE");
  });

  return dungeon;
};
