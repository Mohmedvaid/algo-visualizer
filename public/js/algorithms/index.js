/**
 * Algorithm module exports
 * Provides a centralized way to access all pathfinding algorithms
 */

export { breadthFirstSearch as bfs } from './bfs.js';
export { depthFirstSearch as dfs } from './dfs.js';
export { dijkstra } from './dijkstra.js';
export { aStar } from './astar.js';
export { greedyBestFirstSearch as greedy } from './greedy.js';
export { bidirectionalSearch as bidirectional } from './bidirectional.js';
export { weightedAStar } from './weightedAStar.js';
export { idaStar } from './idaStar.js';
export { jumpPointSearch as jps } from './jumpPointSearch.js';

/**
 * Algorithm metadata for UI display
 */
export const algorithmMetadata = {
    bfs: {
        name: 'Breadth-First Search',
        description: 'Unweighted algorithm that explores level by level. Guarantees shortest path.',
        weighted: false,
        guaranteesShortestPath: true
    },
    dfs: {
        name: 'Depth-First Search',
        description: 'Unweighted algorithm that explores as far as possible. Does not guarantee shortest path.',
        weighted: false,
        guaranteesShortestPath: false
    },
    dijkstra: {
        name: "Dijkstra's Algorithm",
        description: 'Weighted algorithm that explores uniformly. Guarantees shortest path.',
        weighted: true,
        guaranteesShortestPath: true
    },
    astar: {
        name: 'A* Search',
        description: 'Weighted, heuristic-based algorithm. Faster than Dijkstra and guarantees shortest path.',
        weighted: true,
        guaranteesShortestPath: true
    },
    greedy: {
        name: 'Greedy Best-First Search',
        description: 'Weighted, heuristic-based algorithm. Very fast but does not guarantee shortest path.',
        weighted: true,
        guaranteesShortestPath: false
    },
    bidirectional: {
        name: 'Bidirectional Search',
        description: 'Searches from both start and target simultaneously. Can be faster for large grids.',
        weighted: true,
        guaranteesShortestPath: true
    },
    weightedAStar: {
        name: 'Weighted A*',
        description: 'A* with weighted heuristic (f = g + w*h). Faster than A* but may not guarantee shortest path.',
        weighted: true,
        guaranteesShortestPath: false
    },
    idaStar: {
        name: 'IDA* (Iterative Deepening A*)',
        description: 'Memory-efficient A* variant using iterative deepening. Uses less memory but may be slower.',
        weighted: true,
        guaranteesShortestPath: true
    },
    jps: {
        name: 'Jump Point Search',
        description: 'Optimized A* that jumps over symmetric paths. Very fast on open grids with few obstacles.',
        weighted: true,
        guaranteesShortestPath: true
    }
};

