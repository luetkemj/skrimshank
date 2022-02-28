import _ from "lodash";
import { getState, setState } from "../../index";
import MoveTo from "../components/MoveTo.component";
import { grid, getDirection, getNeighbors } from "../../lib/grid";
import { getEntitiesAtPos } from "../../lib/ecsHelpers";
import { clearContainer } from "../../lib/canvas";
import { interactionKeys } from "./interacting.system";

import { pcQuery } from "../queries";

export const userInputSystem = () => {
  const player = pcQuery.get()[0];
  const { userInput } = getState();
  if (!userInput) return;

  const { key, shiftKey } = userInput;

  const { mode } = getState();

  if (mode === "GAME") {
    if (key === "l") {
      setState((state) => (state.mode = "LOOKING"));
      setState((state) => (state.cursor = player.position));
    }

    if (key === "i") {
      setState((state) => (state.mode = "INTERACTING"));

      // get available interactions from neighbor tiles and set cursor to first available position

      const positions = { N: null, S: null, E: null, W: null };

      // get neighbors (cardinal)
      const neighborPos = getNeighbors(player.position);
      // for each, get interactions
      neighborPos.forEach((pos) => {
        const eAtPos = getEntitiesAtPos(pos);
        const stack = _.orderBy(
          [...eAtPos],
          (entity) => entity.zIndex.z,
          "desc"
        );
        const entity = stack[0];

        const evt = entity.fireEvent("get-interactions", {
          interactor: player,
          interactions: [],
        });

        if (evt.data.interactions.length) {
          const direction = getDirection(entity.position, player.position);
          positions[direction.dir] = entity.position;
        }
      });
      const cursorPosition = _.find(positions, (position) => position);
      if (cursorPosition) {
        setState((state) => (state.cursor = cursorPosition));
      } else {
        console.log("there is nothing nearby to interact with");
        setState((state) => (state.mode = "GAME"));
      }
    }

    pcQuery.get().forEach((entity) => {
      if (key === "ArrowUp") {
        const { x, y, z } = entity.position;
        entity.add(MoveTo, { x, y: y - 1, z });
      }
      if (key === "ArrowRight") {
        const { x, y, z } = entity.position;
        entity.add(MoveTo, { x: x + 1, y, z });
      }
      if (key === "ArrowDown") {
        const { x, y, z } = entity.position;
        entity.add(MoveTo, { x, y: y + 1, z });
      }
      if (key === "ArrowLeft") {
        const { x, y, z } = entity.position;
        entity.add(MoveTo, { x: x - 1, y, z });
      }
    });
  }

  if (mode === "LOOKING") {
    if (key === "Escape") {
      clearContainer("mapOverlay");
      return setState((state) => {
        state.mode = "GAME";
        state.cursor = { x: 0, y: 0 };
      });
    }

    // shift and arrows cycle through items in legend
    if (shiftKey) {
      const { legendPositions, legendPositionsIndex } = getState();

      if (key === "ArrowUp" || key === "ArrowLeft") {
        let newIndex = legendPositionsIndex - 1;
        if (newIndex < 0) {
          newIndex = legendPositions.length - 1;
        }
        setState((state) => {
          state.legendPositionsIndex = newIndex;
          state.cursor = state.legendPositions[state.legendPositionsIndex];
        });
      }

      if (key === "ArrowDown" || key === "ArrowRight") {
        let newIndex = legendPositionsIndex + 1;
        if (newIndex >= legendPositions.length) {
          newIndex = 0;
        }
        setState((state) => {
          state.legendPositionsIndex = newIndex;
          state.cursor = state.legendPositions[state.legendPositionsIndex];
        });
      }
    } else {
      const maybeNewPosition = { ...getState().cursor };
      const increment = 1;

      if (key === "ArrowUp") {
        maybeNewPosition.y -= increment;
      }
      if (key === "ArrowRight") {
        maybeNewPosition.x += increment;
      }
      if (key === "ArrowDown") {
        maybeNewPosition.y += increment;
      }
      if (key === "ArrowLeft") {
        maybeNewPosition.x -= increment;
      }

      // check if location is within bounds
      const { x, y } = maybeNewPosition;
      if (x >= 0 && x < grid.map.width && y >= 0 && y < grid.map.height) {
        setState((state) => (state.cursor = maybeNewPosition));
      }
    }
  }

  if (mode === "INTERACTING") {
    if (key === "Escape") {
      clearContainer("mapOverlay");
      return setState((state) => (state.mode = "GAME"));
    }

    // always start from player position for interactions
    const maybeNewPosition = { ...player.position };

    if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(key)) {
      if (key === "ArrowUp") {
        maybeNewPosition.y -= 1;
      }
      if (key === "ArrowRight") {
        maybeNewPosition.x += 1;
      }
      if (key === "ArrowDown") {
        maybeNewPosition.y += 1;
      }
      if (key === "ArrowLeft") {
        maybeNewPosition.x -= 1;
      }
      setState((state) => (state.cursor = maybeNewPosition));
    }

    if (interactionKeys.includes(key)) {
      const index = _.findIndex(interactionKeys, (k) => k === key);
      const { interactions, interactor, interactee } = getState();
      const interaction = interactions[index];
      // if interaction has an interactee use that (cause it's an item) else use the interactee in state
      const caller = interaction.interactee || interactee;

      if (interaction && interactee) {
        caller.fireEvent(interaction.evt, {
          interaction,
          interactor,
          interactee,
        });
        setState((state) => (state.mode = "GAME"));
        clearContainer("mapOverlay");
      }
    }
  }

  setState((state) => (state.userInput = null));
};
