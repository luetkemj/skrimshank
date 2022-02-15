import { world } from "../index";
import Lux from "../components/Lux.component";
import LightSource from "../components/LightSource.component";
import Shadowcaster from "../components/Shadowcaster.component";
import { grid } from "../../lib/grid";
import { createFOV } from "../../lib/fov";
import { getEAtPos } from "../../lib/ecsHelpers";

export const getLux = ({ dist, beam, lumens }) => {
  const lm = lumens;
  const step = lm / beam;
  return lm - dist * step;
};

const luxQuery = world.createQuery({ all: [Lux] });
const lightSourceQuery = world.createQuery({ all: [LightSource] });
const shadowcasterQuery = world.createQuery({ all: [Shadowcaster] });

export const lightingSystem = () => {
  // clear out and unrender stale lux
  // todo: remove this hack
  // hack: spreading the query to get past a caching bug in geotic
  [...luxQuery.get()].forEach((entity) => {
    // fovQuery.get().forEach((entity) => {
    entity.remove(entity.lux);
  });

  // calculate lighting for each lightsource (FOV with beam range)
  lightSourceQuery.get().forEach((entity) => {
    // Create FOV schema
    const { width, height } = grid.map;
    const origin = { x: entity.position.x, y: entity.position.y };
    const radius = entity.lightSource.beam;
    const blockingLocations = new Set();

    shadowcasterQuery.get().forEach((entity) => {
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

    // add lux to each entity in any of the locations within FOV (lighting)
    FOV.fov.forEach((locId) => {
      getEAtPos({ x: locId.split(",")[0], y: locId.split(",")[1] }).forEach(
        (eId) => {
          const ent = world.getEntity(eId);
          const dist = FOV.distance[locId];
          const { beam, lumens } = entity.lightSource;
          const lux = getLux({ dist, beam, lumens });

          if (lux) {
            if (!ent.has(Lux)) ent.add(Lux);

            ent.lux.current += lux;
          }
        }
      );
    });
  });
};
