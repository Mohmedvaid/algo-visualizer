import { getNeighbors, reconstructPath } from '../utils.js';

/**
 * Depth-First Search (DFS) Algorithm
 * 
 * Unweighted algorithm that explores as far as possible before backtracking.
 * Uses a stack (recursion or explicit stack).
 * Does NOT guarantee the shortest path.
 * 
 * Time Complexity: O(V + E) where V is vertices and E is edges
 * Space Complexity: O(V) for recursion stack
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function depthFirstSearch(grid, startNode, targetNode) {
    const visitedNodes = [];
    const stack = [startNode];
    const visited = new Set([startNode.id]);
    
    // Initialize start node
    startNode.distance = 0;
    
    // DFS loop
    while (stack.length > 0) {
        const currentNode = stack.pop(); // Pop from end (stack behavior)
        visitedNodes.push(currentNode);
        currentNode.isVisited = true;
        
        // Found target
        if (currentNode === targetNode) {
            const path = reconstructPath(targetNode, startNode);
            return { visitedNodes, path, success: true };
        }
        
        // Explore neighbors (push in reverse order for better visualization)
        const neighbors = getNeighbors(
            currentNode,
            grid,
            grid.length,
            grid[0].length
        );
        
        // Reverse to maintain consistent exploration order
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            if (!visited.has(neighbor.id)) {
                visited.add(neighbor.id);
                neighbor.previousNode = currentNode;
                neighbor.distance = currentNode.distance + 1;
                stack.push(neighbor);
            }
        }
    }
    
    // No path found
    return { visitedNodes, path: [], success: false };
}

