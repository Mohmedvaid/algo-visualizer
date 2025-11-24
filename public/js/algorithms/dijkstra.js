import { getNeighbors, reconstructPath, PriorityQueue } from '../utils.js';

/**
 * Dijkstra's Algorithm
 * 
 * Weighted pathfinding algorithm that finds the shortest path from start to target.
 * Uses a priority queue to always explore the node with the smallest distance first.
 * Guarantees the shortest path for weighted graphs.
 * 
 * Time Complexity: O((V + E) * log V) with binary heap
 * Space Complexity: O(V)
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function dijkstra(grid, startNode, targetNode) {
    const visitedNodes = [];
    const priorityQueue = new PriorityQueue((a, b) => a.distance - b.distance);
    const visited = new Set();
    
    // Initialize all nodes
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const node = grid[row][col];
            node.distance = Infinity;
            node.totalDistance = Infinity;
            node.previousNode = null;
        }
    }
    
    // Initialize start node
    startNode.distance = 0;
    startNode.totalDistance = 0;
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
            
            // Calculate new distance
            const newDistance = currentNode.distance + neighbor.getCost();
            
            // Update if we found a shorter path
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
                neighbor.totalDistance = newDistance; // For Dijkstra, total = distance
                neighbor.previousNode = currentNode;
                priorityQueue.enqueue(neighbor);
            }
        }
    }
    
    // No path found
    return { visitedNodes, path: [], success: false };
}

