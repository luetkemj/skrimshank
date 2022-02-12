import { getState } from "../index";

export const getEAtPos = ({ x, y }) => {
  const { maps, currentMapId } = getState();
  const eAtPos = maps[currentMapId][y][x];
  return [...eAtPos];
};
