import _ from "lodash";
import { clearContainer, printTemplate } from "../lib/canvas";
import { getState } from "../index";
import { interactionKeys } from "../ecs/systems/interacting.system";

const container = "contextMenu";
export const renderContextMenu = () => {
  clearContainer(container);

  if (getState().mode === "GAME") {
    printTemplate({
      container,
      template: [
        { str: "(i)Interact (l)Look (arrow keys)Move", color: 0x666666 },
      ],
    });
  }

  if (getState().mode === "LOOKING") {
    printTemplate({
      container,
      template: [{ str: "(esc)Back (arrow keys)Move", color: 0x666666 }],
    });
  }

  if (getState().mode === "INTERACTING") {
    const { interactions } = getState();
    let bindings = "";

    interactions.forEach((interaction, index) => {
      bindings += `(${interactionKeys[index]})${interaction.name} `;
    });

    printTemplate({
      container,
      template: [
        {
          str: `(esc)Back (arrow keys)Move ${bindings}`,
          color: 0x666666,
        },
      ],
    });
  }
};
