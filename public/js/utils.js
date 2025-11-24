/**
 * Utility functions for pathfinding algorithms
 */

/**
 * Calculate Manhattan distance between two nodes
 * @param {Node} node1 - First node
 * @param {Node} node2 - Second node
 * @returns {number} - Manhattan distance
 */
export function manhattanDistance(node1, node2) {
    return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
}

/**
 * Calculate Euclidean distance between two nodes
 * @param {Node} node1 - First node
 * @param {Node} node2 - Second node
 * @returns {number} - Euclidean distance
 */
export function euclideanDistance(node1, node2) {
    const dx = node1.row - node2.row;
    const dy = node1.col - node2.col;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get valid neighbors of a node (4-directional: up, right, down, left)
 * @param {Node} node - Current node
 * @param {Node[][]} grid - 2D grid array
 * @param {number} rows - Total number of rows
 * @param {number} cols - Total number of columns
 * @returns {Node[]} - Array of neighboring nodes
 */
export function getNeighbors(node, grid, rows, cols) {
    const neighbors = [];
    const { row, col } = node;

    // Directions: [up, right, down, left]
    const directions = [
        [-1, 0], // up
        [0, 1],  // right
        [1, 0],  // down
        [0, -1]  // left
    ];

    for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        // Check bounds
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const neighbor = grid[newRow][newCol];
            if (neighbor && neighbor.isTraversable()) {
                neighbors.push(neighbor);
            }
        }
    }

    return neighbors;
}

/**
 * Reconstruct path from target to start by following previousNode references
 * @param {Node} targetNode - Target node
 * @param {Node} startNode - Start node
 * @returns {Node[]} - Path array from start to target (excluding start and target)
 */
export function reconstructPath(targetNode, startNode) {
    const path = [];
    let currentNode = targetNode.previousNode;

    // Follow previousNode chain backwards until we reach start
    while (currentNode && currentNode !== startNode) {
        path.unshift(currentNode); // Add to beginning for correct order
        currentNode = currentNode.previousNode;
        
        // Safety check to avoid infinite loops
        if (path.length > 10000) {
            console.warn('Path reconstruction seems stuck, breaking loop');
            break;
        }
    }

    return path;
}

/**
 * Generate a unique node ID from row and column
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {string} - Node ID in format "row-col"
 */
export function getNodeId(row, col) {
    return `${row}-${col}`;
}

/**
 * Parse node ID to get row and column
 * @param {string} id - Node ID in format "row-col"
 * @returns {{row: number, col: number}} - Object with row and col properties
 */
export function parseNodeId(id) {
    const [row, col] = id.split('-').map(Number);
    return { row, col };
}

/**
 * Compare function for priority queue (min-heap)
 * Used by Dijkstra's and A* algorithms
 * @param {Node} a - First node
 * @param {Node} b - Second node
 * @returns {number} - Comparison result
 */
export function compareNodes(a, b) {
    // For A*, compare totalDistance (f = g + h)
    if (a.totalDistance !== b.totalDistance) {
        return a.totalDistance - b.totalDistance;
    }
    // Tie-breaker: prefer nodes closer to target (lower heuristic)
    if (a.heuristicDistance !== null && b.heuristicDistance !== null) {
        return a.heuristicDistance - b.heuristicDistance;
    }
    // Final tie-breaker: compare distances
    return a.distance - b.distance;
}

/**
 * Swap two elements in an array
 * @param {Array} array - Array to modify
 * @param {number} i - First index
 * @param {number} j - Second index
 */
export function swap(array, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
}

/**
 * Simple priority queue implementation using binary heap
 * For pathfinding algorithms that need efficient min-heap operations
 */
export class PriorityQueue {
    constructor(compareFn = compareNodes) {
        this.heap = [];
        this.compare = compareFn;
    }

    /**
     * Get parent index
     * @param {number} index - Current index
     * @returns {number} - Parent index
     */
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    /**
     * Get left child index
     * @param {number} index - Current index
     * @returns {number} - Left child index
     */
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    /**
     * Get right child index
     * @param {number} index - Current index
     * @returns {number} - Right child index
     */
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    /**
     * Check if queue is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * Get size of queue
     * @returns {number}
     */
    size() {
        return this.heap.length;
    }

    /**
     * Peek at the top element without removing it
     * @returns {*} - Top element or undefined if empty
     */
    peek() {
        return this.heap[0];
    }

    /**
     * Add element to priority queue
     * @param {*} element - Element to add
     */
    enqueue(element) {
        this.heap.push(element);
        this.bubbleUp(this.heap.length - 1);
    }

    /**
     * Remove and return the top element
     * @returns {*} - Top element or undefined if empty
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const top = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return top;
    }

    /**
     * Bubble up element at index to maintain heap property
     * @param {number} index - Index to bubble up
     */
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
                break;
            }
            swap(this.heap, index, parentIndex);
            index = parentIndex;
        }
    }

    /**
     * Bubble down element at index to maintain heap property
     * @param {number} index - Index to bubble down
     */
    bubbleDown(index) {
        while (true) {
            const leftChildIndex = this.getLeftChildIndex(index);
            const rightChildIndex = this.getRightChildIndex(index);
            let smallestIndex = index;

            if (
                leftChildIndex < this.heap.length &&
                this.compare(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0
            ) {
                smallestIndex = leftChildIndex;
            }

            if (
                rightChildIndex < this.heap.length &&
                this.compare(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0
            ) {
                smallestIndex = rightChildIndex;
            }

            if (smallestIndex === index) {
                break;
            }

            swap(this.heap, index, smallestIndex);
            index = smallestIndex;
        }
    }

    /**
     * Check if element exists in queue
     * @param {*} element - Element to search for
     * @returns {boolean}
     */
    contains(element) {
        return this.heap.includes(element);
    }
}

