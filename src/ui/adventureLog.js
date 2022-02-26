import _ from "lodash";
import { clearContainer, printTemplate } from "../lib/canvas";
import { getState } from "../index";

const container = "adventureLog";
export const renderAdventureLog = () => {
  clearContainer(container);

  const log = getState().adventureLog.slice(0, 3).reverse();
  for (const [i, l] of log.entries()) {
    printTemplate({
      container,
      template: l.log,
      y: i,
      alpha: getState().tick === l.tick ? 1 : 0.5,
    });
  }
};
