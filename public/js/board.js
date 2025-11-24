import { Node } from './node.js';
import { getNodeId } from './utils.js';

/**
 * Board class manages the grid, nodes, and state of the pathfinding visualizer
 * 
 * Responsibilities:
 * - Create and manage the grid of nodes
 * - Handle user interactions (drawing walls, moving nodes)
 * - Maintain start/target node positions
 * - Provide interface for algorithms to access nodes
 */
export class Board {
    /**
     * Creates a new Board instance
     * @param {number} rows - Number of rows in the grid
     * @param {number} cols - Number of columns in the grid
     */
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        
        // Grid structure: 2D array for algorithm access
        this.grid = [];
        
        // Node lookup: Map for O(1) access by ID
        this.nodes = new Map();
        
        // Special nodes
        this.startNode = null;
        this.targetNode = null;
        
        // UI state
        this.isMouseDown = false;
        this.draggedNodeType = null; // 'start', 'target', or null
        this.isAnimating = false;
        this.currentAlgorithm = null;
        
        // DOM references (will be set during initialization)
        this.gridElement = null;
        this.startRow = Math.floor(rows / 2);
        this.startCol = Math.floor(cols / 4);
        this.targetRow = Math.floor(rows / 2);
        this.targetCol = Math.floor(3 * cols / 4);
    }

    /**
     * Initialize the board: create grid and attach event listeners
     * @param {HTMLElement} containerElement - DOM element to render grid into
     */
    initialize(containerElement) {
        this.gridElement = containerElement;
        this.createGrid();
        this.attachEventListeners();
        this.render();
    }

    /**
     * Create the grid structure with nodes
     */
    createGrid() {
        this.grid = [];
        this.nodes.clear();

        for (let row = 0; row < this.rows; row++) {
            const rowArray = [];
            for (let col = 0; col < this.cols; col++) {
                const id = getNodeId(row, col);
                let status = 'unvisited';

                // Set start and target positions
                if (row === this.startRow && col === this.startCol) {
                    status = 'start';
                } else if (row === this.targetRow && col === this.targetCol) {
                    status = 'target';
                }

                const node = new Node(id, row, col, status);
                rowArray.push(node);
                this.nodes.set(id, node);

                // Store references to special nodes
                if (status === 'start') {
                    this.startNode = node;
                } else if (status === 'target') {
                    this.targetNode = node;
                }
            }
            this.grid.push(rowArray);
        }
    }

    /**
     * Render the grid to the DOM
     */
    render() {
        if (!this.gridElement) return;

        // Clear existing grid
        this.gridElement.innerHTML = '';
        
        // Set grid CSS properties - use fixed sizes for consistent rendering
        const nodeSize = 22; // Must match CSS node size
        this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, ${nodeSize}px)`;
        this.gridElement.style.gridTemplateRows = `repeat(${this.rows}, ${nodeSize}px)`;
        
        // Ensure grid fills container
        this.gridElement.style.width = '100%';
        this.gridElement.style.height = '100%';
        this.gridElement.style.overflow = 'auto';

        // Create and append node elements
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                const nodeElement = this.createNodeElement(node);
                this.gridElement.appendChild(nodeElement);
            }
        }
    }

    /**
     * Create a DOM element for a node
     * @param {Node} node - Node instance
     * @returns {HTMLElement} - DOM element for the node
     */
    createNodeElement(node) {
        const element = document.createElement('div');
        element.className = `grid-node node-${node.status}`;
        element.id = node.id;
        element.dataset.row = node.row;
        element.dataset.col = node.col;
        return element;
    }

    /**
     * Update the visual appearance of a node
     * @param {Node} node - Node to update
     * @param {string} status - New status
     */
    updateNodeVisual(node, status) {
        const element = document.getElementById(node.id);
        if (!element) return;

        // Remove all node state classes
        element.className = 'grid-node';
        
        // Add new status class
        element.classList.add(`node-${status}`);
        node.status = status;
    }

    /**
     * Attach event listeners for user interactions
     */
    attachEventListeners() {
        // Mouse events on the grid
        this.gridElement.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.gridElement.addEventListener('mouseup', () => this.handleMouseUp());
        this.gridElement.addEventListener('mouseleave', () => this.handleMouseUp());
        this.gridElement.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Prevent context menu on right click
        this.gridElement.addEventListener('contextmenu', (e) => e.preventDefault());

        // Touch events for mobile support
        this.gridElement.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.gridElement.addEventListener('touchend', () => this.handleMouseUp());
        this.gridElement.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    }

    /**
     * Handle mouse down event
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseDown(e) {
        if (this.isAnimating) return;

        const nodeElement = e.target.closest('.grid-node');
        if (!nodeElement) return;

        const node = this.getNodeById(nodeElement.id);
        if (!node) return;

        this.isMouseDown = true;

        // Check if clicking on start or target node
        if (node.isStart()) {
            this.draggedNodeType = 'start';
        } else if (node.isTarget()) {
            this.draggedNodeType = 'target';
        } else {
            // Toggle wall on regular nodes
            this.toggleWall(node);
        }
    }

    /**
     * Handle mouse up event
     */
    handleMouseUp() {
        this.isMouseDown = false;
        this.draggedNodeType = null;
    }

    /**
     * Handle mouse move event (for dragging nodes and drawing walls)
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
        if (!this.isMouseDown || this.isAnimating) return;

        const nodeElement = e.target.closest('.grid-node');
        if (!nodeElement) return;

        const node = this.getNodeById(nodeElement.id);
        if (!node) return;

        if (this.draggedNodeType === 'start') {
            this.moveStartNode(node);
        } else if (this.draggedNodeType === 'target') {
            this.moveTargetNode(node);
        } else {
            // Drawing walls
            this.toggleWall(node);
        }
    }

    /**
     * Handle touch start event (mobile support)
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        e.preventDefault();
        if (this.isAnimating) return;

        const touch = e.touches[0];
        const nodeElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (!nodeElement || !nodeElement.classList.contains('grid-node')) return;

        const node = this.getNodeById(nodeElement.id);
        if (!node) return;

        this.isMouseDown = true;

        if (node.isStart()) {
            this.draggedNodeType = 'start';
        } else if (node.isTarget()) {
            this.draggedNodeType = 'target';
        } else {
            this.toggleWall(node);
        }
    }

    /**
     * Handle touch move event (mobile support)
     * @param {TouchEvent} e - Touch event
     */
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isMouseDown || this.isAnimating) return;

        const touch = e.touches[0];
        const nodeElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (!nodeElement || !nodeElement.classList.contains('grid-node')) return;

        const node = this.getNodeById(nodeElement.id);
        if (!node) return;

        if (this.draggedNodeType === 'start') {
            this.moveStartNode(node);
        } else if (this.draggedNodeType === 'target') {
            this.moveTargetNode(node);
        } else {
            this.toggleWall(node);
        }
    }

    /**
     * Toggle wall status of a node
     * @param {Node} node - Node to toggle
     */
    toggleWall(node) {
        if (node.isStart() || node.isTarget()) return;

        if (node.status === 'wall') {
            node.status = 'unvisited';
            this.updateNodeVisual(node, 'unvisited');
        } else {
            node.status = 'wall';
            this.updateNodeVisual(node, 'wall');
        }
    }

    /**
     * Move the start node to a new position
     * @param {Node} newNode - New node to set as start
     */
    moveStartNode(newNode) {
        if (!newNode.isTraversable() || newNode.isTarget()) return;

        // Update old start node
        if (this.startNode) {
            this.updateNodeVisual(this.startNode, 'unvisited');
        }

        // Update new start node
        this.startNode = newNode;
        this.startRow = newNode.row;
        this.startCol = newNode.col;
        this.updateNodeVisual(newNode, 'start');
    }

    /**
     * Move the target node to a new position
     * @param {Node} newNode - New node to set as target
     */
    moveTargetNode(newNode) {
        if (!newNode.isTraversable() || newNode.isStart()) return;

        // Update old target node
        if (this.targetNode) {
            this.updateNodeVisual(this.targetNode, 'unvisited');
        }

        // Update new target node
        this.targetNode = newNode;
        this.targetRow = newNode.row;
        this.targetCol = newNode.col;
        this.updateNodeVisual(newNode, 'target');
    }

    /**
     * Get a node by its ID
     * @param {string} id - Node ID
     * @returns {Node|null} - Node instance or null if not found
     */
    getNodeById(id) {
        return this.nodes.get(id) || null;
    }

    /**
     * Get a node by row and column
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Node|null} - Node instance or null if not found
     */
    getNode(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return null;
        }
        return this.grid[row][col];
    }

    /**
     * Clear all pathfinding visualization (visited nodes, path)
     * Preserves walls and start/target positions
     */
    clearPath() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                node.reset();
                
                // Update visual only if not a wall, start, or target
                if (node.status === 'unvisited' || node.status === 'wall') {
                    this.updateNodeVisual(node, node.status);
                }
            }
        }

        // Re-apply start and target visuals
        if (this.startNode) {
            this.updateNodeVisual(this.startNode, 'start');
        }
        if (this.targetNode) {
            this.updateNodeVisual(this.targetNode, 'target');
        }
    }

    /**
     * Clear all walls from the board
     */
    clearWalls() {
        this.clearPath();
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                if (node.status === 'wall') {
                    node.status = 'unvisited';
                    this.updateNodeVisual(node, 'unvisited');
                }
            }
        }
    }

    /**
     * Clear the entire board (walls, paths, reset start/target)
     */
    clearBoard() {
        // Reset to initial state
        this.startRow = Math.floor(this.rows / 2);
        this.startCol = Math.floor(this.cols / 4);
        this.targetRow = Math.floor(this.rows / 2);
        this.targetCol = Math.floor(3 * this.cols / 4);

        this.createGrid();
        this.render();
    }

    /**
     * Get start node
     * @returns {Node|null}
     */
    getStartNode() {
        return this.startNode;
    }

    /**
     * Get target node
     * @returns {Node|null}
     */
    getTargetNode() {
        return this.targetNode;
    }

    /**
     * Set animation state (prevents interactions during animation)
     * @param {boolean} isAnimating - Whether animation is running
     */
    setAnimating(isAnimating) {
        this.isAnimating = isAnimating;
    }

    /**
     * Calculate optimal grid dimensions based on container size
     * Maximizes grid to fill entire available space
     * @param {HTMLElement} container - Container element
     * @returns {{rows: number, cols: number}} - Calculated dimensions
     */
    static calculateDimensions(container) {
        if (!container) {
            return { rows: 30, cols: 50 }; // Default fallback
        }
        
        const containerRect = container.getBoundingClientRect();
        const nodeSize = 22; // Cell size in pixels (must match CSS)
        const gap = 1; // Gap between nodes
        
        // Use full container dimensions - maximize space usage
        const availableWidth = Math.max(containerRect.width, 800);
        const availableHeight = Math.max(containerRect.height, 600);
        
        // Calculate maximum cells that fit perfectly
        const cols = Math.floor(availableWidth / (nodeSize + gap));
        const rows = Math.floor(availableHeight / (nodeSize + gap));
        
        // Return dimensions, ensuring minimum size
        return {
            rows: Math.max(25, rows), // Good minimum for visibility
            cols: Math.max(35, cols)  // Good minimum for visibility
        };
    }
}

