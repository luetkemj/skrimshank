import Appearance from "../components/Appearance";
import Position from "../components/Appearance";
import { world } from "../index";

const visibleQuery = world.createQuery({
  all: [Position, Appearance],
});

export const render = () => {
  visibleQuery.get().forEach((entity) => {
    // console.log(entity);
  });
};
