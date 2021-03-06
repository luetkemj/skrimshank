import _ from "lodash";
import { grid, getNeighborIds } from "../lib/grid";
import { buildDungeon } from "../procgen/dungeon";
import { isPositionImpassable, getNeighborEntities } from "../lib/ecsHelpers";
import * as gfx from "../lib/graphics";
import LightSource from "../ecs/components/LightSource.component";
import Discoverable from "../ecs/components/Discoverable.component";
import { weaponNames } from "../ecs/prefabs/MeleeWeapon.prefabs";

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
  const floorEntities = [];

  Object.values(dungeon.tiles).forEach((tile) => {
    if (tile.sprite === "WALL") {
      const { x, y } = tile;
      const wallEntity = world.createPrefab("Wall", { position: { x, y, z } });
      wallEntities.push(wallEntity);
    }
    if (tile.sprite === "FLOOR") {
      const { x, y } = tile;
      const floorEntity = world.createPrefab("Floor", {
        position: { x, y, z },
      });
      floorEntities.push(floorEntity);
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

    const brazierPositions = [
      { x: x1 + 1, y: y1 + 1 },
      { x: x2 - 2, y: y1 + 1 },
      { x: x1 + 1, y: y2 - 2 },
      { x: x2 - 2, y: y2 - 2 },
    ];

    brazierPositions.forEach((pos) => {
      const roll = _.random(0, 10);
      const { x, y } = pos;
      if (roll > 5) {
        world.createPrefab("Brazier", { position: { x, y, z } });
      } else {
        world.createPrefab(_.sample(weaponNames), { position: { x, y, z } });
      }
    });
  });

  // get perimeter walls
  // const perimeterTiles = _.filter(dungeon.dTiles, (val) =>
  //   val.tags.includes("PERIMETER")
  // ).forEach((tile) => {
  //   const pos = `${tile.x},${tile.y}`;
  //   getEAtPos(pos).forEach((eid) => {
  //     const entity = world.getEntity(eid);
  //     entity.appearance.color = gfx.colors.goblin;
  //   });
  // });

  // const passageTiles = _.filter(dungeon.dTiles, (val) =>
  //   val.tags.includes("PASSAGE")
  // ).forEach((tile) => {
  //   const pos = `${tile.x},${tile.y}`;
  //   getEAtPos(pos).forEach((eid) => {
  //     const entity = world.getEntity(eid);
  //     entity.appearance.color = gfx.colors.blood;
  //   });
  // });

  const maybeDoorTiles = _.filter(
    dungeon.dTiles,
    (val) => val.tags.includes("PASSAGE") && val.tags.includes("PERIMETER")
  );

  const maybeDoorTilePosids = _.keyBy(
    maybeDoorTiles,
    (tile) => `${tile.x},${tile.y}`
  );

  maybeDoorTiles.forEach((tile) => {
    const pos = `${tile.x},${tile.y}`;
    // check neighbors
    // a door cannot have neighbor doors
    const neids = getNeighborIds(pos).map((neid) => {
      const coords = neid.split(",");
      return `${coords[0]},${coords[1]}`;
    });
    const isDoor = !_.some(neids, (posid) => {
      return maybeDoorTilePosids[posid];
    });

    if (isDoor) {
      world.createPrefab("Door", {
        position: { x: tile.x, y: tile.y, z },
      });
    }
  });

  // populate dungeon with baddies
  // get neighbor position
  _.times(10, () => {
    // get possible location
    const candidate = _.sample(floorEntities);

    // if location is not blocked
    if (!isPositionImpassable(candidate.position)) {
      const goblin = world.createPrefab("Goblin");
      goblin.fireEvent("update-position", candidate.position);
      const lockpick = world.createPrefab("Lockpick");
      goblin.fireEvent("try-equip", { entity: lockpick, slot: "leftHand" });
    }
  });

  return dungeon;
};
