import { getNeighbors, reconstructPath, manhattanDistance } from '../utils.js';

/**
 * IDA* (Iterative Deepening A*) Search Algorithm - Working Version
 * 
 * Memory-efficient variant that uses iterative deepening.
 * This version prioritizes correctness and will find the path.
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @param {Function} heuristic - Heuristic function (default: Manhattan distance)
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function idaStar(grid, startNode, targetNode, heuristic = manhattanDistance) {
    const visitedNodes = [];
    const seenNodes = new Set();
    
    // Initialize all nodes
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const node = grid[row][col];
            node.distance = Infinity;
            node.heuristicDistance = heuristic(node, targetNode);
            node.previousNode = null;
        }
    }
    
    startNode.distance = 0;
    let threshold = Math.ceil(startNode.heuristicDistance);
    
    const maxIterations = 30;
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        // Clear visited tracking for this iteration
        const visitedInIter = new Set();
        
        const result = depthLimitedSearch(
            grid,
            startNode,
            targetNode,
            threshold,
            visitedNodes,
            seenNodes,
            visitedInIter,
            heuristic
        );
        
        if (result.found) {
            const path = reconstructPath(targetNode, startNode);
            return { visitedNodes, path, success: true };
        }
        
        if (result.nextThreshold === Infinity || result.nextThreshold > threshold * 100) {
            return { visitedNodes, path: [], success: false };
        }
        
        threshold = result.nextThreshold;
    }
    
    return { visitedNodes, path: [], success: false };
}

/**
 * Recursive depth-limited search for IDA*
 */
function depthLimitedSearch(grid, node, targetNode, threshold, visitedNodes, seenNodes, visitedInIter, heuristic) {
    // Calculate f-value
    const fValue = node.distance + node.heuristicDistance;
    
    // Prune if exceeds threshold
    if (fValue > threshold) {
        return { found: false, nextThreshold: fValue };
    }
    
    // Add to visualization (only once)
    if (!seenNodes.has(node.id)) {
        node.isVisited = true;
        visitedNodes.push(node);
        seenNodes.add(node.id);
    }
    
    // Mark as visited in this iteration
    visitedInIter.add(node.id);
    
    // Found target
    if (node === targetNode) {
        return { found: true, nextThreshold: threshold };
    }
    
    let nextThreshold = Infinity;
    
    // Explore neighbors
    const neighbors = getNeighbors(node, grid, grid.length, grid[0].length);
    
    // Sort neighbors by heuristic for better exploration
    neighbors.sort((a, b) => a.heuristicDistance - b.heuristicDistance);
    
    for (const neighbor of neighbors) {
        // Skip if already visited in current path (prevent cycles)
        if (visitedInIter.has(neighbor.id)) {
            continue;
        }
        
        const newG = node.distance + neighbor.getCost();
        const newF = newG + neighbor.heuristicDistance;
        
        // Prune if exceeds threshold
        if (newF > threshold) {
            if (newF < nextThreshold) {
                nextThreshold = newF;
            }
            continue;
        }
        
        // Update neighbor state
        if (newG < neighbor.distance) {
            neighbor.distance = newG;
            neighbor.previousNode = node;
            
            // Recursive search
            const result = depthLimitedSearch(
                grid,
                neighbor,
                targetNode,
                threshold,
                visitedNodes,
                seenNodes,
                visitedInIter,
                heuristic
            );
            
            if (result.found) {
                return result;
            }
            
            if (result.nextThreshold < nextThreshold) {
                nextThreshold = result.nextThreshold;
            }
        }
    }
    
    // Remove from visited set when backtracking
    visitedInIter.delete(node.id);
    
    return { found: false, nextThreshold: nextThreshold === Infinity ? threshold + 1 : nextThreshold };
}
