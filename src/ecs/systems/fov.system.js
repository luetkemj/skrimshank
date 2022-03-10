import InFov from "../components/InFov.component";
import Lux from "../components/Lux.component";
import Revealed from "../components/Revealed.component";
import { grid } from "../../lib/grid";
import { createFOV } from "../../lib/fov";
import { getEAtPos } from "../../lib/ecsHelpers";
import { world } from "../index";

import { pcQuery, shadowcasterQuery, fovQuery } from "../queries";

export const fovSystem = () => {
  const playerEntity = pcQuery.get()[0];

  // Create FOV schema
  const { width, height } = grid.map;
  const origin = { x: playerEntity.position.x, y: playerEntity.position.y };
  const radius = grid.map.width; // this should come from a component!
  const impassableLocations = new Set();

  shadowcasterQuery.get().forEach((entity) => {
    impassableLocations.add(`${entity.position.x},${entity.position.y}`);
  });

  const FOV = createFOV({
    impassableLocations,
    width,
    height,
    originX: origin.x,
    originY: origin.y,
    radius,
  });

  // clear out and unrender stale fov
  // todo: remove this hack
  // hack: spreading the query to get past a caching bug in geotic
  [...fovQuery.get()].forEach((entity) => {
    // fovQuery.get().forEach((entity) => {
    entity.remove(entity.inFov);
  });

  FOV.fov.forEach((locId) => {
    const [x, y] = locId.split(",");
    const eAtPos = getEAtPos({ x, y });

    if (eAtPos) {
      eAtPos.forEach((eid) => {
        const entity = world.getEntity(eid);
        entity.add(InFov);

        if (entity.has(Lux)) {
          entity.add(Revealed);
        }
      });
    }
  });
};
