import PF from "pathfinding";
import { get, sample, some, times } from "lodash";
import { ALL, toCell, getNeighborIds, grid } from "./grid";
import { setState } from "../index";
import { isPositionBlocking } from "../lib/ecsHelpers";

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

export const aStarBuildGraph = (entities) => {
  const graph = [];
  const { width, height } = grid.map;
  times(height, () => graph.push(new Array(width).fill(0)));

  entities.forEach((entity) => {
    const { x, y } = entity.position;
    if (entity.blocking) {
      graph[y][x] = 1;
    }
  });

  setState((state) => {
    state.aStarGraphs[state.currentMapId] = graph;
  });

  console.log(graph);
  return graph;
};

export const aStar = (start, goal) => {
  const matrix = [...baseMatrix];

  // check each location for a blocking entity.
  // update matrix with blocking entity

  // This graph should be cached!
  Object.keys(cache.entitiesAtLocation).forEach((locId) => {
    if (
      some([...cache.readObj("entitiesAtLocation", locId)], (eId) => {
        return ecs.getEntity(eId).isBlocking;
      })
    ) {
      const cell = toCell(locId);

      matrix[cell.y][cell.x] = 1;
    }
  });

  matrix[start.y][start.x] = 0;
  matrix[goal.y][goal.x] = 0;

  const grid = new PF.Grid(matrix);
  const finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
  });

  const path = finder.findPath(start.x, start.y, goal.x, goal.y, grid);

  return path;
};
