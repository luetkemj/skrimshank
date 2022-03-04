import { aiQuery } from "../queries";

export const aiSystem = () => {
  const ents = aiQuery.get();

  ents.forEach((ent) => {
    ent.fireEvent("take-action");
  });
};
