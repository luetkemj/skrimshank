import { getState, setState } from "../../index";
import MoveTo from "../components/MoveTo.component";
import { grid } from "../../lib/grid";
import { clearContainer } from "../../lib/canvas";
import { interactionKeys } from "./interacting.system";

import { pcQuery } from "../queries";

export const userInputSystem = () => {
  const player = pcQuery.get()[0];
  const { userInput } = getState();
  if (!userInput) return;

  const { key, shiftKey } = userInput;

  const { mode } = getState();

  const initialInteractingPos = {
    x: player.position.x,
    y: player.position.y - 1,
  };

  if (mode === "GAME") {
    if (key === "l") {
      setState((state) => (state.mode = "LOOKING"));
      setState((state) => (state.cursor = player.position));
    }

    if (key === "i") {
      setState((state) => (state.mode = "INTERACTING"));
      setState((state) => (state.cursor = initialInteractingPos));
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
      return setState((state) => (state.mode = "GAME"));
    }

    const maybeNewPosition = { ...getState().cursor };
    const increment = shiftKey ? 5 : 1;

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

      if (interaction && interactee) {
        interactee.fireEvent(interaction.evt, {
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
