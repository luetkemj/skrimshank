import Appearance from "../components/Appearance.component";
import InFov from "../components/InFov.component";
import Lux from "../components/Lux.component";
import Position from "../components/Position.component";
import Revealed from "../components/Revealed.component";
import { world } from "../index";
import { printCell } from "../../lib/canvas";
import { getState } from "../../index";

const revealedQuery = world.createQuery({
  all: [Revealed],
  none: [InFov],
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
  visibleQuery.get().forEach((entity) => {
    if (entity.has(Lux)) {
      entity.appearance.alpha = Math.max(minAlpha, entity.lux.current / 100);
    }
    renderIfOnTop(entity);
  });

  revealedQuery.get().forEach((entity) => {
    entity.appearance.alpha = minAlpha;
    renderIfOnTop(entity);
  });
};
