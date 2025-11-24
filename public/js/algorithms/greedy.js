import { getNeighbors, reconstructPath, PriorityQueue, manhattanDistance } from '../utils.js';

/**
 * Greedy Best-First Search Algorithm
 * 
 * Weighted, heuristic-based algorithm that always expands the node
 * closest to the target (by heuristic only, ignores actual path cost).
 * Very fast but does NOT guarantee the shortest path.
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
export function greedyBestFirstSearch(grid, startNode, targetNode, heuristic = manhattanDistance) {
    const visitedNodes = [];
    const priorityQueue = new PriorityQueue((a, b) => {
        // Greedy: only compare by heuristic (h value)
        const hA = a.heuristicDistance !== null ? a.heuristicDistance : Infinity;
        const hB = b.heuristicDistance !== null ? b.heuristicDistance : Infinity;
        return hA - hB;
    });
    const visited = new Set();
    
    // Initialize all nodes
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const node = grid[row][col];
            node.distance = Infinity;
            node.heuristicDistance = null;
            node.totalDistance = Infinity;
            node.previousNode = null;
        }
    }
    
    // Initialize start node
    startNode.distance = 0;
    startNode.heuristicDistance = heuristic(startNode, targetNode);
    startNode.totalDistance = startNode.heuristicDistance;
    priorityQueue.enqueue(startNode);
    
    // Main algorithm loop
    while (!priorityQueue.isEmpty()) {
        const currentNode = priorityQueue.dequeue();
        
        // Skip if already visited
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
            
            // Calculate heuristic if not already set
            if (neighbor.heuristicDistance === null) {
                neighbor.heuristicDistance = heuristic(neighbor, targetNode);
            }
            
            // Greedy: only update if not yet in queue or if we found a better path
            // Since we only care about heuristic, update previous node for path reconstruction
            if (neighbor.previousNode === null || neighbor.distance === Infinity) {
                neighbor.previousNode = currentNode;
                neighbor.distance = currentNode.distance + neighbor.getCost();
                neighbor.totalDistance = neighbor.heuristicDistance;
                priorityQueue.enqueue(neighbor);
            }
        }
    }
    
    // No path found
    return { visitedNodes, path: [], success: false };
}

