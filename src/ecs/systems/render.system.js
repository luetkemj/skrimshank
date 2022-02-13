import Appearance from "../components/Appearance.component";
import InFov from "../components/InFov.component";
import Position from "../components/Position.component";
import Revealed from "../components/Revealed.component";
import { world } from "../index";
import { clearContainer, printCell } from "../../lib/canvas";
import { getState } from "../../index";

const revealedQuery = world.createQuery({
  all: [Revealed],
  none: [InFov],
});
const visibleQuery = world.createQuery({
  all: [Appearance, InFov, Position],
});

const appearanceQuery = world.createQuery({
  all: [Appearance, Position],
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
    const { char, color, alpha } = entity.appearance;
    printCell({ container: "map", x, y, char, color, alpha });
  }
};

export const renderSystem = () => {
  // don't do this!
  // you don't have to clear the entire map each time.
  // clearContainer("map");
  // don't clear the map - instead store FOV in state and iterate over all entities with Appearance and Position...
  // move the problem to the FOV alg instead of geotic...
  // if that still doesn't work, try making sprites interactive
  // if that still doesn't work, try removing and adding the FOV component another way
  // or more simply - try modifying a value on it
  // trying to determine if the issue is with geotic add/remove or the fov alg or pixi
  // visibleQuery.get().forEach((entity) => {
  //   entity.appearance.alpha = 1;
  //   renderIfOnTop(entity);
  // });
  // revealedQuery.get().forEach((entity) => {
  //   entity.appearance.alpha = 0.2;
  //   renderIfOnTop(entity);
  // });
  // const fov = [getState().FOV.fov];
  appearanceQuery.get().forEach((entity) => {
    const locId = `${entity.position.x},${entity.position.y}`;
    const isRevealed = entity.has(Revealed);
    const isInFov = getState().FOV.fov.has(locId);

    // if revealed
    if (isRevealed) {
      entity.appearance.alpha = 0.2;
      renderIfOnTop(entity);
    }

    if (isInFov) {
      entity.add(Revealed);
      entity.appearance.alpha = 1;
      renderIfOnTop(entity);
    }

    // if (!isRevealed && !isInFov) {
    //   renderIfOnTop
    // }

    // if in FOV

    // // if !revealed and !in FOV
    // if (getState().FOV.fov.has(locId)) {
    //   entity.add(Revealed);
    //   entity.appearance.alpha = 1;
    //   renderIfOnTop(entity);
    // } else {
    //   entity.appearance.alpha = 0;
    //   renderIfOnTop(entity);
    // }
  });
};
