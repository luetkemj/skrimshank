import { random, times } from "lodash";

export const roll = (diceToRoll) => {
  const [n, sides] = diceToRoll.split("d");

  let total = 0;

  times(n, () => {
    total += random(1, sides);
  });

  return total;
};
