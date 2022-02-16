import _ from "lodash";
import { grid } from "../lib/grid";
import { buildDungeon } from "../procgen/dungeon";
import { getEAtPos, getNeighborEntities } from "../lib/ecsHelpers";
import * as gfx from "../lib/graphics";
import LightSource from "../ecs/components/LightSource.component";
import Discoverable from "../ecs/components/Discoverable.component";

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

  const wallEntities = [];

  Object.values(dungeon.tiles).forEach((tile) => {
    if (tile.sprite === "WALL") {
      const { x, y } = tile;
      const wallEntity = world.createPrefab("Wall", { position: { x, y, z } });
      wallEntities.push(wallEntity);
    }
    if (tile.sprite === "FLOOR") {
      const { x, y } = tile;
      world.createPrefab("Floor", { position: { x, y, z } });
    }
  });

  wallEntities.forEach((entity) => {
    const nents = getNeighborEntities({
      x: entity.position.x,
      y: entity.position.y,
    });
    if (
      nents.some((ent) => {
        if (!ent) return false;
        return ent.has(Discoverable);
      })
    ) {
      entity.add(Discoverable);
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
      const roll = _.random(0, 10);
      if (roll > 5) {
        getEAtPos(pos).forEach((eid) => {
          const entity = world.getEntity(eid);

          entity.appearance.color = gfx.colors.fire;
          entity.add(LightSource, { lumens: 100, beam: 10 });
        });
      }
    });
  });

  return dungeon;
};
