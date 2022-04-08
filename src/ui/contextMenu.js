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
  }
};
