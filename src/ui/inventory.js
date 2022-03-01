import _ from "lodash";
import wrapAnsi from "wrap-ansi";
import { world } from "../ecs/index";
import { getState } from "../index";
import {
  clearContainer,
  hideContainer,
  showContainer,
  printTemplate,
} from "../lib/canvas";

const container = "menu";
const width = 57;

export const renderInventory = (player) => {
  if (getState().mode === "MENU_INVENTORY") {
    clearContainer(container);
    showContainer(container);

    printTemplate({
      container,
      template: [{ str: " -- INVENTORY --" }],
      y: 1,
    });

    const items = player.inventory.contentIds.map((eid) =>
      world.getEntity(eid)
    );

    const { inventoryIndex } = getState();

    if (!items.length) {
      printTemplate({
        container,
        y: 3,
        template: [{ str: "    Your inventory is empty." }],
      });
    } else {
      items.forEach((item, index) => {
        const isSelected = inventoryIndex === index;

        printTemplate({
          container,
          y: 3 + index,
          template: [
            {
              str: `  ${isSelected ? "*" : " "} ${item.display.simple}`,
            },
          ],
        });
      });

      // print description
      const selectedItem = items[inventoryIndex];

      // gonna need to add descriptions
      const description = `${selectedItem.display.description}`;
      const content = wrapAnsi(description, width - 4).split("\n");

      content.forEach((line, index) => {
        printTemplate({
          container,
          y: 3 + index,
          x: width,
          template: [{ str: `    ${line}` }],
        });
      });
    }
  } else {
    hideContainer(container);
  }
};
