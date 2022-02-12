import Appearance from "../components/Appearance.component";
import Position from "../components/Position.component";
import { world } from "../index";
import { clearContainer, printCell } from "../../lib/canvas";

const visibleQuery = world.createQuery({
  all: [Position, Appearance],
});

export const renderSystem = () => {
  // don't do this!
  // you don't have to clear the entire map each time.
  clearContainer("map");

  visibleQuery.get().forEach((entity) => {
    const { x, y } = entity.position;
    const { char, color } = entity.appearance;
    printCell({ container: "map", x, y, char, color });
  });
};
