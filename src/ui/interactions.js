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

    let y = 2;
    let keyBinding = 0;

    const { interactions } = getState();

    const interactTemplates = interactions.interact.map((interaction) => {
      const template = {
        str: `(${interactionKeys[keyBinding]})${interaction.name}`,
      };
      keyBinding++;

      return template;
    });

    const applyTemplates = interactions.apply.map((interaction) => {
      const template = {
        str: `(${interactionKeys[keyBinding]})${interaction.name}`,
      };
      keyBinding++;

      return template;
    });

    const meleeTemplates = interactions.melee.map((interaction) => {
      const template = {
        str: `(${interactionKeys[keyBinding]})${interaction.name}`,
      };
      keyBinding++;

      return template;
    });

    interactTemplates.forEach((tmpl) => {
      printTemplate({
        container,
        template: [tmpl],
        y,
      });

      y++;
    });

    y++;

    applyTemplates.forEach((tmpl) => {
      printTemplate({
        container,
        template: [tmpl],
        y,
      });

      y++;
    });

    y++;

    meleeTemplates.forEach((tmpl) => {
      printTemplate({
        container,
        template: [tmpl],
        y,
      });

      y++;
    });
  }
};
