import Appearance from "../components/Appearance.component";
import Position from "../components/Position.component";
import { world } from "../index";
import { clearContainer, printCell } from "../../lib/canvas";
import { getState } from "../../index";

const visibleQuery = world.createQuery({
  all: [Position, Appearance],
});

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
    const { char, color } = entity.appearance;
    printCell({ container: "map", x, y, char, color });
  }
};

export const renderSystem = () => {
  // don't do this!
  // you don't have to clear the entire map each time.
  clearContainer("map");

  visibleQuery.get().forEach((entity) => {
    renderIfOnTop(entity);
  });
};
