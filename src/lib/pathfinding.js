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
  times(height, () => graph.push(new Array(width).fill(1)));

  entities.forEach((entity) => {
    const { x, y } = entity.position;
    if (entity.blocking) {
      graph[y][x] = 0;
    }
  });

  setState((state) => {
    state.astarGrids[state.currentMapId] = graph;
  });
};

// not working yet - not sure if grid is off or inputs here are off.
export const aStar = (start, end) => {
  const grid = getState().astarGrids[getState().currentMapId];
  const graph = new Graph(grid);

  const aStart = graph.grid[start.y][start.x];
  const aEnd = graph.grid[end.y][end.x];
  const result = astar.search(graph, aStart, aEnd);

  console.log({ grid, graph, aStart, aEnd, result, start, end });

  return result;
};

// export const aStar = (start, goal) => {
//   const matrix = [...baseMatrix];

//   // check each location for a blocking entity.
//   // update matrix with blocking entity

//   // This graph should be cached!
//   Object.keys(cache.entitiesAtLocation).forEach((locId) => {
//     if (
//       some([...cache.readObj("entitiesAtLocation", locId)], (eId) => {
//         return ecs.getEntity(eId).isBlocking;
//       })
//     ) {
//       const cell = toCell(locId);

//       matrix[cell.y][cell.x] = 1;
//     }
//   });

//   matrix[start.y][start.x] = 0;
//   matrix[goal.y][goal.x] = 0;

//   const grid = new PF.Grid(matrix);
//   const finder = new PF.AStarFinder({
//     allowDiagonal: true,
//     dontCrossCorners: true,
//   });

//   const path = finder.findPath(start.x, start.y, goal.x, goal.y, grid);

//   return path;
// };
