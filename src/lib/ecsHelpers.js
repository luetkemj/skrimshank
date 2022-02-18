import _ from "lodash";
import { getState } from "../index";
import { getNeighborIds, toCell } from "./grid";
import { world } from "../ecs/index";

export const getEAtPos = (cellOrPosId) => {
  const { x, y } = toCell(cellOrPosId);
  const { maps, currentMapId } = getState();
  const eAtPos = _.get(maps, `${currentMapId}[${y}][${x}]`, []);
  return [...eAtPos];
};

export const getEntitiesAtPos = (cellOrPosid) => {
  return getEAtPos(cellOrPosid).map((eid) => world.getEntity(eid));
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
