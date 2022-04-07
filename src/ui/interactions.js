import { getState } from "../index";
import { clearContainer, printTemplate } from "../lib/canvas";
import { interactionKeys } from "../ecs/systems/interacting.system";

const container = "interactions";

export const renderInteractionsMenu = () => {
  clearContainer(container);

  if (getState().mode === "INTERACTING") {
    printTemplate({
      container,
      template: [
        {
          str: "Interactions (esc)Back",
        },
      ],
    });

    const { interactions } = getState();
    console.log(interactions);

    let bindings = "";

    interactions.forEach((interaction, index) => {
      bindings += `(${interactionKeys[index]})${interaction.name} `;
    });

    const templates = interactions.map((interaction, index) => {
      return {
        str: `(${interactionKeys[index]})${interaction.name}`,
      };
    });

    console.log(templates);

    templates.forEach((tmpl, i) => {
      printTemplate({
        container,
        template: [tmpl],
        y: i + 2,
      });
    });
  }
};
