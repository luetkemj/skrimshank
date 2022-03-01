import _ from "lodash";
import {
  clearContainer,
  printTemplate,
  showFloat,
  hideFloat,
} from "../lib/canvas";
import { getState } from "../index";
import { interactionKeys } from "../ecs/systems/interacting.system";

const container = "contextMenu";
export const renderContextMenu = (position) => {
  clearContainer(container);

  const color = 0x666666;

  if (getState().mode === "GAME") {
    hideFloat("float");

    printTemplate({
      container,
      template: [{ str: "(i)Interact (l)Look (arrow keys)Move", color }],
    });
  }

  if (getState().mode === "MENU_INVENTORY") {
    printTemplate({
      container,
      template: [{ str: "(esc)Back (arrow keys)Select Item", color }],
    });
  }

  if (getState().mode === "LOOKING") {
    printTemplate({
      container,
      template: [
        {
          str: "Looking: (esc)Back (arrow keys)Move (shift + arrow keys)Cycle",
          color,
        },
      ],
    });
  }

  if (getState().mode === "INTERACTING") {
    printTemplate({
      container,
      template: [
        {
          str: "Interacting: (esc)Back (arrow keys)Move",
          color,
        },
      ],
    });

    // all the rest relating to the float menu can probably go somewhere else. but for now...
    clearContainer("float");
    const { interactions } = getState();
    let bindings = "";

    interactions.forEach((interaction, index) => {
      bindings += `(${interactionKeys[index]})${interaction.name} `;
    });

    const templates = interactions.map((interaction, index) => {
      return {
        str: `(${interactionKeys[index]})${interaction.name}`,
      };
    });
    showFloat("float", position, templates, 0x0c444e);
  }
};
