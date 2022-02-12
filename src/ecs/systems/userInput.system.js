import { getState, setState } from "../../index";
import PC from "../components/PC.component";
import MoveTo from "../components/MoveTo.component";
import { world } from "../index";

const pcQuery = world.createQuery({
  all: [PC],
});

export const userInputSystem = () => {
  const { userInput } = getState();
  if (!userInput) return;

  const { key, shiftKey } = userInput;

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

  setState((state) => (state.userInput = null));
};
