import Appearance from "../components/Appearance.component";
import Shadowcaster from "../components/Shadowcaster.component";
import InFov from "../components/InFov.component";
import Lux from "../components/Lux.component";
import Position from "../components/Position.component";
import Revealed from "../components/Revealed.component";
import { world } from "../index";
import { printCell } from "../../lib/canvas";
import { getState } from "../../index";
import { getNeighborEntities } from "../../lib/ecsHelpers";

const revealedQuery = world.createQuery({
  all: [Revealed],
  none: [InFov],
});
const shadowcasterQuery = world.createQuery({
  all: [Shadowcaster],
});
const visibleQuery = world.createQuery({
  all: [Appearance, InFov, Position],
});

const minAlpha = 0.1;

const isOnTop = (eid, eAtPos) => {
  let zIndex = 0;
  let eidOnTop = eid;
  eAtPos.forEach((id) => {
    const candidate = world.getEntity(id).zIndex.z;
    if (candidate > zIndex) {
      zIndex = candidate;
      eidOnTop = id;
    }
  });
  return eidOnTop === eid;
};

const renderIfOnTop = (entity) => {
  const { x, y } = entity.position;
  const { maps, currentMapId } = getState();
  const entitiesAtPosition = maps[currentMapId][y][x];
  const shouldRender = isOnTop(entity.id, [...entitiesAtPosition]);

  if (shouldRender) {
    const { char, color, alpha } = entity.appearance;
    printCell({ container: "map", x, y, char, color, alpha });
  }
};

export const renderSystem = () => {
  // todp: perf - filter out undiscoverable entities from this query
  shadowcasterQuery.get().forEach((entity) => {
    if (entity.has(Revealed)) {
      entity.appearance.alpha = minAlpha;
    } else {
      entity.appearance.alpha = 0;
    }
    renderIfOnTop(entity);
  });

  visibleQuery.get().forEach((entity) => {
    if (entity.has(Lux)) {
      entity.appearance.alpha = Math.max(
        minAlpha,
        entity.lux.ambient + entity.lux.current / 100
      );
    }

    if (entity.has(Shadowcaster)) {
      // look at neighbors with InFOV use brightest lux
      const { x, y } = entity.position;
      let lux = 0;

      getNeighborEntities({ x, y }).forEach((ent) => {
        if (ent.has(Lux)) {
          const candidate = ent.lux.ambient + ent.lux.current;
          if (lux < candidate) lux = candidate;
        }
      });
      entity.appearance.alpha = Math.max(minAlpha, lux / 100);
    }

    renderIfOnTop(entity);
  });

  revealedQuery.get().forEach((entity) => {
    entity.appearance.alpha = minAlpha;
    renderIfOnTop(entity);
  });
};
