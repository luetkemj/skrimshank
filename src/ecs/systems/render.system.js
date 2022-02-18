import Shadowcaster from "../components/Shadowcaster.component";
import InFov from "../components/InFov.component";
import Lux from "../components/Lux.component";
import PC from "../components/PC.component";
import Revealed from "../components/Revealed.component";
import { world } from "../index";
import { printCell } from "../../lib/canvas";
import { getState } from "../../index";
import { getEntitiesAtPos, getNeighborEntities } from "../../lib/ecsHelpers";

import {
  pcQuery,
  appearanceQuery,
  revealedQuery,
  shadowcasterQuery,
  visibleQuery,
} from "../queries";

const minAlpha = 0.1;

const isOnTopEntity = (entity, entitiesAtPos) => {
  let zIndex = 0;
  let entityOnTop = entity;

  entitiesAtPos.forEach((entity) => {
    const candidate = entity.zIndex.z;
    if (candidate > zIndex) {
      zIndex = candidate;
      entityOnTop = entity;
    }
  });
  return entityOnTop.id === entity.id;
};

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
  // always reset player to minAlpha with the assumption they will get relit by their own light source
  // or by neighoring entities like shadowcasters
  pcQuery.get().forEach((entity) => {
    entity.appearance.alpha = minAlpha;
  });

  // reset shadowcaster alpha
  shadowcasterQuery.get().forEach((entity) => {
    // Currently Revealed is only ever ADDED to an entity
    // if an entity has been revealed, reset it's alpha to the minAlpha
    if (entity.has(Revealed)) {
      entity.appearance.alpha = minAlpha;
    }
    renderIfOnTop(entity);
  });

  const visibleEnts = [...pcQuery.get(), ...visibleQuery.get()];

  visibleEnts.forEach((entity) => {
    // The Lux component stores ambient and current lux
    // ambient and current lux are combined to determine the final alpha of a rendered sprite
    // (see lighting system for more details)
    if (entity.has(Lux)) {
      entity.appearance.alpha = Math.max(
        minAlpha,
        (entity.lux.ambient + entity.lux.current) / 100
      );
    }

    // The player entity is treated similar to shadowcasters
    // Shadowcasters are opaque entitites that block light and cast shadows
    // Shadowcasters get their light from neighboring tiles within player FOV
    // This is because a lightsource outside of FOV on the other side of a wall will light said wall making it appear translucent
    // To solve this problem we set a shadowcasters lux to that of it's brightest neighbor with FOV
    if (entity.has(Shadowcaster) || entity.has(PC)) {
      // look at neighbors with InFOV use brightest lux
      const { x, y } = entity.position;
      let lux = 0;
      getNeighborEntities({ x, y }).forEach((ent) => {
        // Only get lux from neighboring entities that are on top, have lux, are in fov, and NOT shadowcasters
        const onTopEntity = isOnTopEntity(
          ent,
          getEntitiesAtPos(ent.position).filter((e) => e.has(Shadowcaster))
        );
        if (onTopEntity && ent.has(Lux) && ent.has(InFov)) {
          const candidate = ent.lux.ambient + ent.lux.current;
          if (lux < candidate) lux = candidate;
        }
      });
      if (lux > minAlpha) {
        entity.appearance.alpha = lux / 100;
      }

      // if an entity has been lit, it has been revealed
      if (lux) {
        entity.add(Revealed);
      }
    }

    renderIfOnTop(entity);
  });

  revealedQuery.get().forEach((entity) => {
    entity.appearance.alpha = minAlpha;
    renderIfOnTop(entity);
  });

  // DEBUG:
  // Uncomment to render everything at 100% alpha.
  // appearanceQuery.get().forEach((entity) => {
  //   entity.appearance.alpha = 1;
  //   renderIfOnTop(entity);
  // });
};
