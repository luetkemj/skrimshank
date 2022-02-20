import _ from "lodash";
import { clearContainer, printTemplate } from "../lib/canvas";
import { getState } from "../index";

const container = "contextMenu";
export const renderContextMenu = () => {
  clearContainer(container);

  if (getState().mode === "GAME") {
    printTemplate({
      container,
      template: [{ str: "(l)Look (arrow keys)Move", color: 0x666666 }],
    });
  }

  if (getState().mode === "LOOKING") {
    printTemplate({
      container,
      template: [{ str: "(esc)Back (arrow keys)Move", color: 0x666666 }],
    });
  }
};
