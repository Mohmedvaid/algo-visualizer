import { getNeighbors, reconstructPath, PriorityQueue, manhattanDistance } from '../utils.js';

/**
 * A* Search Algorithm
 * 
 * Weighted, heuristic-based pathfinding algorithm.
 * Uses f(n) = g(n) + h(n) where:
 * - g(n) = actual distance from start to current node
 * - h(n) = estimated distance from current node to target (heuristic)
 * 
 * Guarantees the shortest path while being faster than Dijkstra's
 * by using heuristics to prioritize promising paths.
 * 
 * Time Complexity: O((V + E) * log V) with binary heap
 * Space Complexity: O(V)
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @param {Function} heuristic - Heuristic function (default: Manhattan distance)
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function aStar(grid, startNode, targetNode, heuristic = manhattanDistance) {
    const visitedNodes = [];
    const priorityQueue = new PriorityQueue((a, b) => {
        // Compare by totalDistance (f = g + h)
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
            node.totalDistance = Infinity; // f(n) = g(n) + h(n)
            node.previousNode = null;
        }
    }
    
    // Initialize start node
    startNode.distance = 0;
    startNode.heuristicDistance = heuristic(startNode, targetNode);
    startNode.totalDistance = startNode.distance + startNode.heuristicDistance;
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
            
            // Calculate new f value
            const newTotalDistance = newDistance + neighbor.heuristicDistance;
            
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

