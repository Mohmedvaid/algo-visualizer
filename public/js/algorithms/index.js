/**
 * Algorithm module exports
 * Provides a centralized way to access all pathfinding algorithms
 */

export { breadthFirstSearch as bfs } from './bfs.js';
export { depthFirstSearch as dfs } from './dfs.js';
export { dijkstra } from './dijkstra.js';
export { aStar } from './astar.js';

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
    }
};

