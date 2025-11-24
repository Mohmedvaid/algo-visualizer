import { getNeighbors, reconstructPath } from '../utils.js';

/**
 * Breadth-First Search (BFS) Algorithm
 * 
 * Unweighted algorithm that explores level by level using a queue.
 * Guarantees the shortest path for unweighted graphs.
 * 
 * Time Complexity: O(V + E) where V is vertices and E is edges
 * Space Complexity: O(V)
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function breadthFirstSearch(grid, startNode, targetNode) {
    const visitedNodes = [];
    const queue = [startNode];
    const visited = new Set([startNode.id]);
    
    // Initialize start node
    startNode.distance = 0;
    
    // BFS loop
    while (queue.length > 0) {
        const currentNode = queue.shift(); // Dequeue from front
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
            if (!visited.has(neighbor.id)) {
                visited.add(neighbor.id);
                neighbor.previousNode = currentNode;
                neighbor.distance = currentNode.distance + 1;
                queue.push(neighbor);
            }
        }
    }
    
    // No path found
    return { visitedNodes, path: [], success: false };
}

