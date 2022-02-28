import _ from "lodash";
import { getState, setState } from "../../index";
import { getEntitiesAtPos } from "../../lib/ecsHelpers";
import { pcQuery } from "../queries";
import { world } from "../index";

export const applyingSystem = () => {
  const isInteractingMode = getState().mode === "INTERACTING";
  if (!isInteractingMode) return;

  const playerEnt = pcQuery.get()[0];
  const cursorPos = getState().cursor;
  const eAtPos = getEntitiesAtPos(cursorPos);
  const stack = _.orderBy([...eAtPos], (entity) => entity.zIndex.z, "desc");
  const entity = stack[0];

  const evts = [];

  if (playerEnt.inventory) {
    playerEnt.inventory.contentIds.forEach((eid) => {
      const ent = world.getEntity(eid);

      const evt = ent.fireEvent("get-applications", {
        interactor: ent,
        interactions: [],
        interactee: entity,
      });
      if (evt) {
        evts.push(evt);
      }
    });
  }

  setState((state) => {
    state.interactions = [
      ...state.interactions,
      ..._.flatMap(evts, (e) => e.data.interactions),
    ];
  });
};
