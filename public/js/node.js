/**
 * Node class representing a single cell in the pathfinding grid
 * 
 * Each node maintains its state, position, and algorithm-specific properties
 * for pathfinding calculations.
 */
export class Node {
    /**
     * Creates a new Node instance
     * @param {string} id - Unique identifier (format: "row-col")
     * @param {number} row - Row position in the grid
     * @param {number} col - Column position in the grid
     * @param {string} status - Initial status ('unvisited', 'wall', 'start', 'target')
     */
    constructor(id, row, col, status = 'unvisited') {
        this.id = id;
        this.row = row;
        this.col = col;
        this.status = status;
        
        // Pathfinding properties
        this.previousNode = null;
        this.distance = Infinity;
        this.heuristicDistance = null;
        this.totalDistance = Infinity; // For A* (f = g + h)
        
        // Weight for weighted algorithms (default: 1)
        this.weight = 1;
        
        // Animation flags
        this.isVisited = false;
        this.isInPath = false;
    }

    /**
     * Reset node to initial state (used when clearing paths)
     * Preserves wall status but resets pathfinding properties
     */
    reset() {
        if (this.status !== 'wall' && this.status !== 'start' && this.status !== 'target') {
            this.status = 'unvisited';
        }
        this.previousNode = null;
        this.distance = Infinity;
        this.heuristicDistance = null;
        this.totalDistance = Infinity;
        this.isVisited = false;
        this.isInPath = false;
    }

    /**
     * Check if node is traversable (not a wall)
     * @returns {boolean}
     */
    isTraversable() {
        return this.status !== 'wall';
    }

    /**
     * Check if node is the start node
     * @returns {boolean}
     */
    isStart() {
        return this.status === 'start';
    }

    /**
     * Check if node is the target node
     * @returns {boolean}
     */
    isTarget() {
        return this.status === 'target';
    }

    /**
     * Get the actual cost to move to this node
     * @returns {number}
     */
    getCost() {
        return this.weight;
    }

    /**
     * Set distance and update total distance if heuristic exists
     * @param {number} distance - New distance value
     */
    setDistance(distance) {
        this.distance = distance;
        if (this.heuristicDistance !== null) {
            this.totalDistance = this.distance + this.heuristicDistance;
        }
    }

    /**
     * Set heuristic distance and update total distance
     * @param {number} heuristic - Heuristic value
     */
    setHeuristic(heuristic) {
        this.heuristicDistance = heuristic;
        this.totalDistance = this.distance + this.heuristicDistance;
    }

    /**
     * Clone node properties (useful for algorithm state management)
     * @returns {Object} - Cloned node data
     */
    clone() {
        return {
            id: this.id,
            row: this.row,
            col: this.col,
            status: this.status,
            distance: this.distance,
            totalDistance: this.totalDistance,
            heuristicDistance: this.heuristicDistance,
            weight: this.weight
        };
    }
}

