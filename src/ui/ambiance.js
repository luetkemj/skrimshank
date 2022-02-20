import _ from "lodash";
import { clearContainer, printTemplate } from "../lib/canvas";
import { getState } from "../index";

const container = "ambiance";
export const renderAmbiance = () => {
  clearContainer(container);
  printTemplate({
    container,
    template: getState().ambiance,
  });
};
