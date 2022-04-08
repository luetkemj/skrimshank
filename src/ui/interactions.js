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
          str: "Actions (esc)Back",
        },
      ],
    });

    let y = 2;
    let keyBinding = 0;

    const { interactions } = getState();

    const interactTemplates = interactions.interact.map((interaction) => {
      const template = {
        str: `(${interactionKeys[keyBinding]})${interaction.name} ${interaction.interactee.display.name}`,
      };
      keyBinding++;

      return template;
    });

    const applyTemplates = interactions.apply.map((interaction) => {
      console.log(interaction);
      const template = {
        str: `(${interactionKeys[keyBinding]})${interaction.name} with ${interaction.interactant.display.name}`,
      };
      keyBinding++;

      return template;
    });

    const meleeTemplates = interactions.melee.map((interaction) => {
      const template = {
        str: `(${interactionKeys[keyBinding]})${interaction.name} with ${interaction.interactant.display.name}`,
      };
      keyBinding++;

      return template;
    });

    if (interactTemplates.length) {
      printTemplate({
        container,
        template: [{ str: "Interact" }],
        y,
      });
      y++;

      interactTemplates.forEach((tmpl) => {
        printTemplate({
          container,
          template: [tmpl],
          y,
          x: 1,
        });
        y++;
      });

      y++;
    }

    if (applyTemplates.length) {
      printTemplate({
        container,
        template: [{ str: "Apply" }],
        y,
      });
      y++;

      applyTemplates.forEach((tmpl) => {
        printTemplate({
          container,
          template: [tmpl],
          y,
          x: 1,
        });

        y++;
      });

      y++;
    }

    if (meleeTemplates.length) {
      printTemplate({
        container,
        template: [{ str: "Melee" }],
        y,
      });
      y++;

      meleeTemplates.forEach((tmpl) => {
        printTemplate({
          container,
          template: [tmpl],
          y,
          x: 1,
        });

        y++;
      });
    }
  }
};
