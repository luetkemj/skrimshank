import { get, sample, some, times } from "lodash";
import { ALL, toCell, getNeighborIds, grid } from "./grid";
import { getState, setState } from "../index";
import { Graph, astar } from "./astar";

export const drunkenWalk = () => sample(ALL);

export const walkDijkstra = (entity, dMapName) => {
  const neighbors = getNeighborIds(entity.position, "ALL");
  const inf = 1000000;
  let score = inf;
  let nextPosition = {};
  neighbors.forEach((locId) => {
    const dScore = get(cache, `dijkstraMaps[${dMapName}][${locId}]`, inf);
    if (dScore < score) {
      score = dScore;
      nextPosition = toCell(locId);
    }
  });
  return nextPosition;
};

export const astarBuildGrid = (entities) => {
  const graph = [];
  const { width, height } = grid.map;
  times(height, () => graph.push(new Array(width).fill(0)));

  entities.forEach((entity) => {
    const { x, y } = entity.position;
    const wt = get(entity, "astar.wt", 1);
    if (!entity.impassable) {
      graph[y][x] += wt;
    }
  });

  setState((state) => {
    state.astarGrids[state.currentMapId] = graph;
  });
};

// todo: perf
// consider how often we really need to be generating a new Graph
// that seems to be the real slow down - not getting a new path.
export const aStar = (start, end) => {
  const grid = getState().astarGrids[getState().currentMapId];
  const graph = new Graph(grid);

  const aStart = graph.grid[start.y][start.x];
  const aEnd = graph.grid[end.y][end.x];
  const result = astar.search(graph, aStart, aEnd);

  console.log({ grid, graph, aStart, aEnd, result, start, end });

  return result;
};
