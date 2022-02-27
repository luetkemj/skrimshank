import _ from "lodash";
import { clearContainer, printTemplate } from "../lib/canvas";
import { distance } from "../lib/grid";
import { minAlpha } from "../ecs/systems/render.system";
import PC from "../ecs/components/PC.component";

const container = "legend";

export const renderLegend = (ents) => {
  clearContainer(container);

  const lEnts = ents.filter((ent) => {
    return ent.appearance && ent.appearance.alpha > minAlpha;
  });

  const [player] = _.remove(lEnts, (ent) => ent.has(PC));

  const orderedLegend = _.orderBy(lEnts, (ent) => {
    return distance(player.position, ent.position);
  });

  {
    const { char, color, alpha } = player.appearance;
    const name = player.display.simple;
    printTemplate({
      container,
      template: [{ str: `${char} `, color, alpha }, { str: name }],
      y: 0,
    });
  }

  orderedLegend.forEach((ent, i) => {
    const { char, color, alpha } = ent.appearance;
    const name = ent.display.simple;

    printTemplate({
      container,
      template: [{ str: `${char} `, color, alpha }, { str: name }],
      y: i + 1,
    });
  });
};
