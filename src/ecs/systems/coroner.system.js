import { coronerQuery } from "../queries";
import * as gfx from "../../lib/graphics";

export const coronerSystem = () => {
  const ents = coronerQuery.get();

  ents.forEach((ent) => {
    ent.fireEvent("ChangeChar", { value: gfx.chars.corpse });
    if (ent.bumpable) ent.bumpable.destroy();
    if (ent.brain) ent.brain.destroy();
    if (ent.isDead) ent.isDead.destroy();
    // add a corpse component for use in raising the dead?
  });
};
