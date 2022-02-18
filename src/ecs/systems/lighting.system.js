import { getState, setState } from "../../index";
import { world } from "../index";
import Lux from "../components/Lux.component";
import PC from "../components/PC.component";
import Shadowcaster from "../components/Shadowcaster.component";
import { grid } from "../../lib/grid";
import { createFOV } from "../../lib/fov";
import { getEAtPos } from "../../lib/ecsHelpers";
import { luxQuery, lightSourceQuery, shadowcasterQuery } from "../queries";

export const getLux = ({ dist, beam, lumens }) => {
  const lm = lumens;
  const step = lm / beam;
  return lm - dist * step;
};

export const lightingSystem = () => {
  // some events like open/closing doors require stationary lights to be recalulated
  // these events will set a flag in game state. We check that here and if it's true
  // fire events to all lightsource entities to trigger the recalc flag
  if (getState().recalcLighting) {
    lightSourceQuery.get().forEach((entity) => {
      entity.fireEvent("recalc-light");
    });
    // ambient light is additive so we need to reset it at the start of recalc
    luxQuery.get().forEach((entity) => {
      entity.fireEvent("recalc-light");
    });

    setState((state) => (state.recalcLighting = false));
  }

  // The Lux component tracks the current and ambient lux on given cell
  // Ambient lux is calculated from stationary lightsources that don't need to be recalculated
  // Current lux is calculated from non stationary lightsources
  // Both are added together in the render system to determe the alpha of a rendered sprite

  // Current lux is recalculated every turn. So we need to start by resetting it to 0
  luxQuery.get().forEach((entity) => {
    entity.lux.current = 0;
  });

  // calculate lighting for each lightsource (FOV with beam range)
  lightSourceQuery.get().forEach((entity) => {
    // The LightSource component has stationary and recalc flags
    // A stationary lightSource generates ambient light and will only be calculated if the recalc flag is set to true
    if (entity.lightSource.stationary && !entity.lightSource.recalc) {
      return;
    }

    // Every lightsource has a field of vision that determines where it's cast light will fall.
    // The radius is equal to the beam property on LightSource
    // createFOV is expensive so we should minimize recalculating light sources
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

    // FOV.fov contains an array of posIds "1,1"
    // each posId is a location within a lightsource's FOV
    // for each posId:
    //    get all entities at that position skipping Shadowcasters (we deal with those later)
    //    determine the lux of that location based on lumens of and distance to LightSource
    //    add ambient lux if LightSource is stationary
    //    else add to current lux
    FOV.fov.forEach((locId) => {
      getEAtPos({ x: locId.split(",")[0], y: locId.split(",")[1] }).forEach(
        (eId) => {
          const ent = world.getEntity(eId);

          // Shadowcaster ents share the lux of their neighbors.
          // if ent is Shadowcaster return
          if (ent.has(Shadowcaster)) return;

          // the player is similar to a shadowcaster and is dealt with later
          if (ent.has(PC)) return;

          // get lux based on the lumens and distance from LightSource
          const dist = FOV.distance[locId];
          const { beam, lumens } = entity.lightSource;
          const lux = getLux({ dist, beam, lumens });

          if (lux) {
            if (!ent.has(Lux)) ent.add(Lux);

            if (entity.lightSource.stationary) {
              ent.lux.ambient += lux;
            } else {
              ent.lux.current += lux;
            }
          }
        }
      );
    });

    entity.lightSource.recalc = false;
  });
};
