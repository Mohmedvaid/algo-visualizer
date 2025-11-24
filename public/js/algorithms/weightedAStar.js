import { getNeighbors, reconstructPath, PriorityQueue, manhattanDistance } from '../utils.js';

/**
 * Weighted A* Search Algorithm
 * 
 * Variant of A* that uses a weighted heuristic: f(n) = g(n) + w * h(n)
 * where w > 1 is a weight factor.
 * 
 * This makes the algorithm favor nodes closer to the target more heavily,
 * resulting in faster pathfinding but potentially suboptimal paths.
 * When w = 1, it's equivalent to standard A*.
 * 
 * Time Complexity: O((V + E) * log V) with binary heap
 * Space Complexity: O(V)
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @param {number} weight - Weight factor for heuristic (default: 1.5)
 * @param {Function} heuristic - Heuristic function (default: Manhattan distance)
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function weightedAStar(grid, startNode, targetNode, weight = 1.5, heuristic = manhattanDistance) {
    const visitedNodes = [];
    const priorityQueue = new PriorityQueue((a, b) => {
        // Compare by weighted totalDistance
        if (a.totalDistance !== b.totalDistance) {
            return a.totalDistance - b.totalDistance;
        }
        // Tie-breaker: prefer nodes with better heuristic
        return (a.heuristicDistance || 0) - (b.heuristicDistance || 0);
    });
    const visited = new Set();
    
    // Initialize all nodes
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const node = grid[row][col];
            node.distance = Infinity; // g(n)
            node.heuristicDistance = null; // h(n)
            node.totalDistance = Infinity; // f(n) = g(n) + w * h(n)
            node.previousNode = null;
        }
    }
    
    // Initialize start node
    startNode.distance = 0;
    startNode.heuristicDistance = heuristic(startNode, targetNode);
    startNode.totalDistance = startNode.distance + weight * startNode.heuristicDistance;
    priorityQueue.enqueue(startNode);
    
    // Main algorithm loop
    while (!priorityQueue.isEmpty()) {
        const currentNode = priorityQueue.dequeue();
        
        // Skip if already visited with a better path
        if (visited.has(currentNode.id)) {
            continue;
        }
        
        visited.add(currentNode.id);
        visitedNodes.push(currentNode);
        currentNode.isVisited = true;
        
        // Found target
        if (currentNode === targetNode) {
            const path = reconstructPath(targetNode, startNode);
            return { visitedNodes, path, success: true };
        }
        
        // Explore neighbors
        const neighbors = getNeighbors(
            currentNode,
            grid,
            grid.length,
            grid[0].length
        );
        
        for (const neighbor of neighbors) {
            if (visited.has(neighbor.id)) {
                continue;
            }
            
            // Calculate new g value (distance from start)
            const newDistance = currentNode.distance + neighbor.getCost();
            
            // Calculate heuristic if not already set
            if (neighbor.heuristicDistance === null) {
                neighbor.heuristicDistance = heuristic(neighbor, targetNode);
            }
            
            // Calculate new f value with weight: f = g + w * h
            const newTotalDistance = newDistance + weight * neighbor.heuristicDistance;
            
            // Update if we found a better path
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
                neighbor.totalDistance = newTotalDistance;
                neighbor.previousNode = currentNode;
                priorityQueue.enqueue(neighbor);
            }
        }
    }
    
    // No path found
    return { visitedNodes, path: [], success: false };
}

