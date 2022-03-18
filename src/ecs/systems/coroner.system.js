import { coronerQuery } from "../queries";
import * as gfx from "../../lib/graphics";

export const coronerSystem = () => {
  const ents = coronerQuery.get();

  ents.forEach((ent) => {
    ent.fireEvent("ChangeChar", { value: gfx.chars.corpse });
    ent.bumpable.destroy();
    ent.brain.destroy();
    ent.isDead.destroy();
    // add a corpse component for use in rasing the dead?
  });
};
