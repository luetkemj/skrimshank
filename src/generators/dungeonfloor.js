import _ from "lodash";
import { grid } from "../lib/grid";
import { buildDungeon } from "../procgen/dungeon";

export const generateDungeonFloor = ({ world, z = 0 }) => {
  const dungeon = buildDungeon({
    x: 0,
    y: 0,
    z,
    width: grid.map.width,
    height: grid.map.height,
    // minRoomSize: 4,
    // maxRoomSize: 10,
    // maxRoomCount: 10,
  });

  Object.values(dungeon.tiles).forEach((tile) => {
    if (tile.sprite === "WALL") {
      const { x, y } = tile;
      world.createPrefab("Wall", { position: { x, y, z } });
    }
    if (tile.sprite === "FLOOR") {
      const { x, y } = tile;
      world.createPrefab("Floor", { position: { x, y, z } });
    }
  });

  return dungeon;
};
