import { getNeighbors, reconstructPath, PriorityQueue, manhattanDistance } from '../utils.js';

/**
 * Jump Point Search (JPS) Algorithm
 * 
 * Optimization of A* that prunes symmetric paths by only expanding
 * nodes that are "jump points" - points where the path must change direction.
 * 
 * Works by jumping over uniform-cost areas and only stopping at:
 * - Forced neighbors (obstacles create forced paths)
 * - Natural neighbors (when we reach the goal or change direction)
 * 
 * This dramatically reduces the number of nodes explored in open spaces.
 * 
 * Time Complexity: O((V + E) * log V) with binary heap, but explores far fewer nodes than A*
 * Space Complexity: O(V)
 * 
 * @param {Node[][]} grid - 2D array of nodes
 * @param {Node} startNode - Starting node
 * @param {Node} targetNode - Target node
 * @param {Function} heuristic - Heuristic function (default: Manhattan distance)
 * @returns {{visitedNodes: Node[], path: Node[]}} - Object containing visited nodes and path
 */
export function jumpPointSearch(grid, startNode, targetNode, heuristic = manhattanDistance) {
    const visitedNodes = [];
    const priorityQueue = new PriorityQueue((a, b) => {
        if (a.totalDistance !== b.totalDistance) {
            return a.totalDistance - b.totalDistance;
        }
        return (a.heuristicDistance || 0) - (b.heuristicDistance || 0);
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
    startNode.totalDistance = startNode.distance + startNode.heuristicDistance;
    priorityQueue.enqueue(startNode);
    
    // Main algorithm loop
    while (!priorityQueue.isEmpty()) {
        const currentNode = priorityQueue.dequeue();
        
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
        
        // Get direction from previous node
        const direction = getDirection(currentNode.previousNode, currentNode);
        
        // Identify successors (jump points)
        const successors = identifySuccessors(
            grid,
            currentNode,
            targetNode,
            direction,
            heuristic
        );
        
        for (const successor of successors) {
            if (visited.has(successor.id)) {
                continue;
            }
            
            // Calculate distance
            const jumpDistance = getJumpDistance(currentNode, successor);
            const newDistance = currentNode.distance + jumpDistance;
            
            if (newDistance < successor.distance) {
                successor.distance = newDistance;
                if (successor.heuristicDistance === null) {
                    successor.heuristicDistance = heuristic(successor, targetNode);
                }
                successor.totalDistance = successor.distance + successor.heuristicDistance;
                successor.previousNode = currentNode;
                priorityQueue.enqueue(successor);
            }
        }
    }
    
    // No path found
    return { visitedNodes, path: [], success: false };
}

/**
 * Get direction from previous node to current node
 */
function getDirection(prevNode, currentNode) {
    if (!prevNode) {
        return null; // Start node
    }
    
    const dRow = currentNode.row - prevNode.row;
    const dCol = currentNode.col - prevNode.col;
    
    // Normalize direction
    if (dRow === 0) return dCol > 0 ? { row: 0, col: 1 } : { row: 0, col: -1 };
    if (dCol === 0) return dRow > 0 ? { row: 1, col: 0 } : { row: -1, col: 0 };
    
    // Diagonal
    return {
        row: dRow > 0 ? 1 : -1,
        col: dCol > 0 ? 1 : -1
    };
}

/**
 * Identify successors (jump points) for a node
 */
function identifySuccessors(grid, node, targetNode, direction, heuristic) {
    const successors = [];
    const rows = grid.length;
    const cols = grid[0].length;
    
    if (!direction) {
        // Start node - explore all neighbors by jumping
        const neighbors = getNeighbors(node, grid, rows, cols);
        for (const neighbor of neighbors) {
            const dir = getDirection(node, neighbor);
            const jumpPoint = jump(grid, node, dir, targetNode, rows, cols);
            if (jumpPoint && jumpPoint !== node) {
                successors.push(jumpPoint);
            }
        }
        return successors;
    }
    
    // Check for forced neighbors at next position
    const nextRow = node.row + direction.row;
    const nextCol = node.col + direction.col;
    
    if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
        const nextNode = grid[nextRow][nextCol];
        if (nextNode.isTraversable()) {
            // Check for forced neighbors
            const forcedNeighbors = getForcedNeighbors(grid, nextNode, direction, rows, cols);
            
            if (forcedNeighbors.length > 0) {
                // Found forced neighbors - nextNode is a jump point
                successors.push(nextNode);
            } else {
                // Continue jumping in same direction
                const jumpPoint = jump(grid, nextNode, direction, targetNode, rows, cols);
                if (jumpPoint && jumpPoint !== nextNode) {
                    successors.push(jumpPoint);
                } else if (jumpPoint === nextNode) {
                    successors.push(nextNode);
                }
            }
        }
    }
    
    return successors;
}

/**
 * Jump in a direction until hitting a wall or finding a jump point
 */
function jump(grid, node, direction, targetNode, rows, cols) {
    const nextRow = node.row + direction.row;
    const nextCol = node.col + direction.col;
    
    // Check bounds
    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
        return null;
    }
    
    const nextNode = grid[nextRow][nextCol];
    
    // Hit a wall
    if (!nextNode.isTraversable()) {
        return null;
    }
    
    // Found target
    if (nextNode === targetNode) {
        return nextNode;
    }
    
    // Check for forced neighbors
    const forcedNeighbors = getForcedNeighbors(grid, nextNode, direction, rows, cols);
    if (forcedNeighbors.length > 0) {
        return nextNode; // Jump point found
    }
    
    // Diagonal movement - also check horizontal and vertical
    if (direction.row !== 0 && direction.col !== 0) {
        // Check horizontal jump
        const horizontalJump = jump(
            grid,
            nextNode,
            { row: 0, col: direction.col },
            targetNode,
            rows,
            cols
        );
        if (horizontalJump) return nextNode;
        
        // Check vertical jump
        const verticalJump = jump(
            grid,
            nextNode,
            { row: direction.row, col: 0 },
            targetNode,
            rows,
            cols
        );
        if (verticalJump) return nextNode;
    }
    
    // Continue jumping
    return jump(grid, nextNode, direction, targetNode, rows, cols);
}

/**
 * Get forced neighbors - neighbors that must be checked due to obstacles
 */
function getForcedNeighbors(grid, node, direction, rows, cols) {
    const forced = [];
    
    // For horizontal/vertical movement, check perpendicular directions
    if (direction.row === 0) {
        // Moving horizontally - check above and below
        const checkRow1 = node.row - 1;
        const checkRow2 = node.row + 1;
        const checkCol = node.col + direction.col;
        
        if (checkRow1 >= 0 && checkCol >= 0 && checkCol < cols) {
            const node1 = grid[checkRow1][checkCol];
            const wall1 = checkRow1 >= 0 ? grid[checkRow1][node.col] : null;
            if (node1 && node1.isTraversable() && 
                (!wall1 || !wall1.isTraversable())) {
                forced.push(node1);
            }
        }
        
        if (checkRow2 < rows && checkCol >= 0 && checkCol < cols) {
            const node2 = grid[checkRow2][checkCol];
            const wall2 = checkRow2 < rows ? grid[checkRow2][node.col] : null;
            if (node2 && node2.isTraversable() && 
                (!wall2 || !wall2.isTraversable())) {
                forced.push(node2);
            }
        }
    } else if (direction.col === 0) {
        // Moving vertically - check left and right
        const checkCol1 = node.col - 1;
        const checkCol2 = node.col + 1;
        const checkRow = node.row + direction.row;
        
        if (checkCol1 >= 0 && checkRow >= 0 && checkRow < rows) {
            const node1 = grid[checkRow][checkCol1];
            const wall1 = checkCol1 >= 0 ? grid[node.row][checkCol1] : null;
            if (node1 && node1.isTraversable() && 
                (!wall1 || !wall1.isTraversable())) {
                forced.push(node1);
            }
        }
        
        if (checkCol2 < cols && checkRow >= 0 && checkRow < rows) {
            const node2 = grid[checkRow][checkCol2];
            const wall2 = checkCol2 < cols ? grid[node.row][checkCol2] : null;
            if (node2 && node2.isTraversable() && 
                (!wall2 || !wall2.isTraversable())) {
                forced.push(node2);
            }
        }
    }
    // For diagonal movement, forced neighbors are more complex
    // Simplified version - check if path is blocked
    
    return forced;
}

/**
 * Calculate jump distance between two nodes
 */
function getJumpDistance(node1, node2) {
    const dRow = Math.abs(node2.row - node1.row);
    const dCol = Math.abs(node2.col - node1.col);
    
    // Manhattan distance (for simplicity, could use diagonal distance)
    return dRow + dCol;
}

