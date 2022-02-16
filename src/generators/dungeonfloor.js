import _ from "lodash";
import { grid } from "../lib/grid";
import { buildDungeon } from "../procgen/dungeon";
import { getEAtPos } from "../lib/ecsHelpers";
import * as gfx from "../lib/graphics";
import LightSource from "../ecs/components/LightSource.component";

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

  // add light sources
  dungeon.rooms.forEach((room) => {
    const { x1, x2, y1, y2 } = room;

    const torchPositions = [
      { x: x1 + 1, y: y1 + 1 },
      { x: x2 - 2, y: y1 + 1 },
      { x: x1 + 1, y: y2 - 2 },
      { x: x2 - 2, y: y2 - 2 },
    ];

    torchPositions.forEach((pos) => {
      getEAtPos(pos).forEach((eid) => {
        const entity = world.getEntity(eid);

        entity.appearance.color = gfx.colors.fire;
        entity.add(LightSource, { lumens: 100, beam: 5 });
      });
    });
  });

  return dungeon;
};
