import _ from "lodash";
import { getState, setState } from "../index";
import { clearContainer, printTemplate } from "../lib/canvas";
import { distance } from "../lib/grid";
import * as gfx from "../lib/graphics";
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

  setState((state) => {
    state.legendPositions = [
      player.position,
      ...orderedLegend.map((ent) => ent.position),
    ];
  });

  {
    const { char, color } = player.appearance;
    const name = player.display.simple;
    const isLooking = getState().mode === "LOOKING";
    const isLookingAtPlayer = getState().legendPositionsIndex === 0;

    const playerNameColor =
      isLooking && isLookingAtPlayer ? gfx.colors.default : undefined;
    printTemplate({
      container,
      template: [
        { str: ` ${char} `, color },
        { str: `${name}`, color: playerNameColor },
      ],
      y: 0,
    });
  }

  orderedLegend.forEach((ent, i) => {
    const { char, color } = ent.appearance;
    const name = ent.display.simple;
    const { x: cx, y: cy } = getState().cursor;
    const { x: ex, y: ey } = ent.position;

    const isLooking = getState().mode === "LOOKING";
    const isInteracting = getState().mode === "INTERACTING";
    const isDirectedAt = cx === ex && cy === ey;

    // check if current item in legend is being looked at
    let nameColor;

    if (isLooking && isDirectedAt) {
      nameColor = gfx.colors.default;
    }

    if (isInteracting && isDirectedAt) {
      nameColor = gfx.colors.revealed;
    }

    printTemplate({
      container,
      template: [
        { str: ` ${char} `, color },
        { str: `${name}`, color: nameColor },
      ],
      y: i + 1,
    });
  });
};
