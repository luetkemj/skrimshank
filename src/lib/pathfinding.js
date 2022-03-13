import PF from "pathfinding";
import { get, sample, some, times, tail } from "lodash";
import { ALL, toCell, getNeighborIds, grid } from "./grid";
import { getState, setState } from "../index";

export const astarBuildGrid = (entities) => {
  const graph = [];
  const { width, height } = grid.map;
  times(height, () => graph.push(new Array(width).fill(1)));

  entities.forEach((entity) => {
    const { x, y } = entity.position;
    if (!entity.impassable) {
      graph[y][x] = 0;
    }
  });

  setState((state) => {
    state.astarGrids[state.currentMapId] = graph;
  });
};

export const aStar = (start, end) => {
  const grid = getState().astarGrids[getState().currentMapId];

  const pfGrid = new PF.Grid(grid);
  const finder = new PF.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: true,
  });

  const path = finder.findPath(start.x, start.y, end.x, end.y, pfGrid);

  return tail(path);
};
