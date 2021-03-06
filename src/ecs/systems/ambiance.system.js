import _ from "lodash";
import { getState, setState } from "../../index";
import { getEntitiesAt } from "../../lib/ecsHelpers";
import { pcQuery } from "../queries";
import { minAlpha } from "./render.system";
import * as gfx from "../../lib/graphics";

// get ambiance text
export const ambianceSystem = () => {
  const playerEnt = pcQuery.get()[0];
  let ambiancePos = playerEnt.position;
  let index = 1;
  const isGameMode = getState().mode === "GAME";
  const isLookingMode = getState().mode === "LOOKING";

  if (isGameMode) {
    ambiancePos = playerEnt.position;
    index = 1;
  }

  if (isLookingMode) {
    ambiancePos = getState().cursor;
    index = 0;
  }
  const eAtPos = getEntitiesAt(ambiancePos);
  const stack = _.orderBy([...eAtPos], (entity) => entity.zIndex.z, "desc");
  const entity = stack[index];

  if (isLookingMode) {
    setState((state) => {
      const isInFov = entity.inFov;
      const isInDarkness =
        entity.appearance.alpha > 0 && entity.appearance.alpha <= minAlpha;
      const isRevealed = entity.revealed;

      if (!isRevealed) {
        return (state.ambiance = [{ str: `` }]);
      }

      if (isInFov && isInDarkness) {
        return (state.ambiance = [
          {
            str: `You're pretty sure there is ${stack[index].display.detailed} in the darkness`,
            color: gfx.colors.default,
          },
        ]);
      }

      if (isInFov && !isInDarkness) {
        return (state.ambiance = [
          {
            str: `You see ${stack[index].display.detailed}`,
            color: gfx.colors.default,
          },
        ]);
      }

      if (isRevealed && !isInFov) {
        return (state.ambiance = [
          {
            str: `You recall seeing ${stack[index].display.detailed} here`,
            color: gfx.colors.default,
          },
        ]);
      }
    });
  }

  if (isGameMode) {
    if (entity.inFov && entity) {
      return (getState().ambiance = [
        { str: `There is ${stack[index].display.detailed} beneath your feet` },
      ]);
    }
  }
};
