import InFov from "../components/InFov.component";
import Opaque from "../components/Opaque.component";
import PC from "../components/PC.component";
import Revealed from "../components/Revealed.component";
import { grid } from "../../lib/grid";
import { createFOV } from "../../lib/fov";
import { getEAtPos } from "../../lib/ecsHelpers";
import { getState } from "../../index";
import { world } from "../index";

const pcQuery = world.createQuery({ all: [PC] });
const opaqueQuery = world.createQuery({ all: [Opaque] });
const fovQuery = world.createQuery({ all: [InFov] });

export const fovSystem = () => {
  const playerEntity = pcQuery.get()[0];

  // Create FOV schema
  const { width, height } = grid.map;
  const origin = { x: playerEntity.position.x, y: playerEntity.position.y };
  const radius = 10; // this should come from a component!
  const blockingLocations = new Set();

  opaqueQuery.get().forEach((entity) => {
    blockingLocations.add(`${entity.position.x},${entity.position.y}`);
  });

  const FOV = createFOV({
    blockingLocations,
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
        entity.add(Revealed);
        // addComponent(world, FovDistance, eidAtPos);
        // addComponent(world, InFov, eidAtPos);
        // if (hasComponent(world, Lux, eidAtPos)) {
        //   addComponent(world, Revealed, eidAtPos);
        // }
        // FovDistance.dist[eidAtPos] = FOV.distance[locId];
      });
    }
  });
};
