import { getNeighbors, PriorityQueue } from '../utils.js';

/**
 * Bidirectional Search Algorithm
 * 
 * Searches simultaneously from both start and target nodes using BFS.
 * When the two searches meet, a path has been found.
 * Can be faster than unidirectional search for large grids.
 * 
 * Time Complexity: O(b^(d/2)) where b is branching factor, d is depth
 * Space Complexity: O(b^(d/2))
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function bidirectionalSearch(grid, startNode, targetNode) {
    const visitedNodes = [];
    
    // Forward search (from start) - use simple queue for BFS
    const forwardQueue = [startNode];
    const forwardVisited = new Set([startNode.id]);
    
    // Backward search (from target) - use simple queue for BFS
    const backwardQueue = [targetNode];
    const backwardVisited = new Set([targetNode.id]);
    
    // Initialize all nodes
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const node = grid[row][col];
            node.distance = Infinity;
            node.previousNode = null;
            node.backwardPrevious = null;
            node.backwardDistance = Infinity;
        }
    }
    
    // Initialize forward search
    startNode.distance = 0;
    
    // Initialize backward search
    targetNode.backwardDistance = 0;
    
    let meetingNode = null;
    
    // Main algorithm loop - alternate between forward and backward
    while (forwardQueue.length > 0 || backwardQueue.length > 0) {
        // Forward search step
        if (forwardQueue.length > 0) {
            const currentForward = forwardQueue.shift();
            
            visitedNodes.push(currentForward);
            currentForward.isVisited = true;
            
            // Check if we've met the backward search
            if (backwardVisited.has(currentForward.id)) {
                meetingNode = currentForward;
                break;
            }
            
            // Explore neighbors
            const neighbors = getNeighbors(
                currentForward,
                grid,
                grid.length,
                grid[0].length
            );
            
            for (const neighbor of neighbors) {
                if (!forwardVisited.has(neighbor.id)) {
                    forwardVisited.add(neighbor.id);
                    neighbor.previousNode = currentForward;
                    neighbor.distance = currentForward.distance + 1;
                    forwardQueue.push(neighbor);
                    
                    // Check if this neighbor was visited by backward search
                    if (backwardVisited.has(neighbor.id)) {
                        meetingNode = neighbor;
                        break;
                    }
                }
            }
            
            if (meetingNode) break;
        }
        
        // Backward search step
        if (backwardQueue.length > 0) {
            const currentBackward = backwardQueue.shift();
            
            // Add to visited nodes if not already added
            if (!visitedNodes.includes(currentBackward)) {
                visitedNodes.push(currentBackward);
                currentBackward.isVisited = true;
            }
            
            // Check if we've met the forward search
            if (forwardVisited.has(currentBackward.id)) {
                if (!meetingNode) {
                    meetingNode = currentBackward;
                }
                break;
            }
            
            // Explore neighbors (backward)
            const neighbors = getNeighbors(
                currentBackward,
                grid,
                grid.length,
                grid[0].length
            );
            
            for (const neighbor of neighbors) {
                if (!backwardVisited.has(neighbor.id)) {
                    backwardVisited.add(neighbor.id);
                    neighbor.backwardPrevious = currentBackward;
                    neighbor.backwardDistance = currentBackward.backwardDistance + 1;
                    backwardQueue.push(neighbor);
                    
                    // Check if this neighbor was visited by forward search
                    if (forwardVisited.has(neighbor.id)) {
                        meetingNode = neighbor;
                        break;
                    }
                }
            }
            
            if (meetingNode) break;
        }
    }
    
    // Reconstruct path from meeting point
    if (meetingNode) {
        const path = [];
        
        // Build path from start to meeting point
        let currentNode = meetingNode.previousNode;
        while (currentNode && currentNode !== startNode) {
            path.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        
        // Add meeting node (if not start)
        if (meetingNode !== startNode) {
            path.push(meetingNode);
        }
        
        // Build path from meeting point to target
        currentNode = meetingNode.backwardPrevious;
        while (currentNode && currentNode !== targetNode) {
            path.push(currentNode);
            currentNode = currentNode.backwardPrevious;
        }
        
        return { visitedNodes, path, success: true };
    }
    
    // No path found
    return { visitedNodes, path: [], success: false };
}

