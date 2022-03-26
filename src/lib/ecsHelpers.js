import _ from "lodash";
import { getState } from "../index";
import { circle, getNeighborIds, toCell } from "./grid";
import { world } from "../ecs/index";

export const createGoal = ({ goal, name, originalIntent, data }) => {
  const createdGoal = world.createPrefab("Goal", {
    goal,
    display: { name },
    data,
  });

  const ogIntent = originalIntent || createdGoal.id;

  createdGoal.goal.originalIntent = ogIntent;
  createdGoal.originalIntent = ogIntent;
  createdGoal.data = data;

  return createdGoal;
};

export const getEntity = (eid) => world.getEntity(eid);

export const getEAtPos = (cellOrPosId) => {
  const { x, y } = toCell(cellOrPosId);
  const { maps, currentMapId } = getState();
  const eAtPos = _.get(maps, `${currentMapId}[${y}][${x}]`, []);
  return [...eAtPos];
};

export const getEntitiesAt = (cellOrPosid) => {
  return getEAtPos(cellOrPosid).map((eid) => world.getEntity(eid));
};

export const getEntitiesInRange = (center, range) => {
  const locationsInRange = circle(center, range);
  const entities = locationsInRange.flatMap((loc) =>
    getEAtPos(loc).map((eid) => world.getEntity(eid))
  );
  return entities;
};

// pretty sure this works - although it is untested.
export const isPositionImpassable = (cellOrPosid) => {
  const entities = getEntitiesAt(cellOrPosid);
  return find(entities, (ent) => ent.impassable);
};

export const getNeighborEntities = ({ x, y, direction = "CARDINAL" }) => {
  const { currentMapId } = getState();
  const z = currentMapId.split(",")[2];
  const posIds = getNeighborIds({ x, y, z }, direction);
  const entities = [];
  posIds.forEach((posId) => {
    getEAtPos(posId).forEach((eid) => {
      entities.push(world.getEntity(eid));
    });
  });

  return entities;
};
