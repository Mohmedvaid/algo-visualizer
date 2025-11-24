import { Board } from './board.js';

/**
 * Main application controller
 * Initializes and manages the pathfinding visualizer
 */
class PathfindingVisualizer {
    constructor() {
        this.board = null;
        this.currentAlgorithm = null;
        
        // DOM references
        this.gridContainer = null;
        this.algorithmSelect = null;
        this.visualizeBtn = null;
        this.clearPathBtn = null;
        this.clearWallsBtn = null;
        this.clearBoardBtn = null;
        this.speedSelect = null;
        this.algorithmInfo = null;
        
        // Animation state
        this.animationSpeed = 'medium';
        this.isVisualizing = false;
    }

    /**
     * Initialize the application
     */
    init() {
        this.getDOMElements();
        this.initializeBoard();
        this.attachEventListeners();
        this.updateAlgorithmInfo('');
    }

    /**
     * Get references to DOM elements
     */
    getDOMElements() {
        this.gridContainer = document.getElementById('grid');
        this.algorithmSelect = document.getElementById('algorithm-select');
        this.visualizeBtn = document.getElementById('visualize-btn');
        this.clearPathBtn = document.getElementById('clear-path-btn');
        this.clearWallsBtn = document.getElementById('clear-walls-btn');
        this.clearBoardBtn = document.getElementById('clear-board-btn');
        this.speedSelect = document.getElementById('speed-select');
        this.algorithmInfo = document.getElementById('algorithm-info');
        
        if (!this.gridContainer) {
            throw new Error('Grid container not found');
        }
    }

    /**
     * Initialize the board with calculated dimensions
     */
    initializeBoard() {
        // Calculate optimal grid size based on container
        const dimensions = Board.calculateDimensions(this.gridContainer);
        
        // Create board instance
        this.board = new Board(dimensions.rows, dimensions.cols);
        
        // Initialize and render
        this.board.initialize(this.gridContainer);
    }

    /**
     * Attach event listeners to UI controls
     */
    attachEventListeners() {
        // Algorithm selection
        this.algorithmSelect.addEventListener('change', (e) => {
            this.onAlgorithmSelect(e.target.value);
        });

        // Visualize button
        this.visualizeBtn.addEventListener('click', () => {
            this.onVisualizeClick();
        });

        // Clear buttons
        this.clearPathBtn.addEventListener('click', () => {
            this.onClearPath();
        });

        this.clearWallsBtn.addEventListener('click', () => {
            this.onClearWalls();
        });

        this.clearBoardBtn.addEventListener('click', () => {
            this.onClearBoard();
        });

        // Speed selection
        this.speedSelect.addEventListener('change', (e) => {
            this.animationSpeed = e.target.value;
        });

        // Maze generation (placeholder for now)
        const mazeSelect = document.getElementById('maze-select');
        if (mazeSelect) {
            mazeSelect.addEventListener('change', (e) => {
                this.onMazeSelect(e.target.value);
            });
        }

        // Handle window resize to recalculate grid size
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Handle algorithm selection
     * @param {string} algorithm - Selected algorithm name
     */
    onAlgorithmSelect(algorithm) {
        this.currentAlgorithm = algorithm;
        this.visualizeBtn.disabled = !algorithm;
        
        if (algorithm) {
            this.updateAlgorithmInfo(algorithm);
        } else {
            this.updateAlgorithmInfo('');
        }
    }

    /**
     * Handle visualize button click
     */
    onVisualizeClick() {
        if (!this.currentAlgorithm || this.isVisualizing) {
            return;
        }

        // Clear previous visualization
        this.board.clearPath();
        
        // Disable controls during visualization
        this.setControlsEnabled(false);
        this.board.setAnimating(true);
        this.isVisualizing = true;

        // TODO: Run algorithm and animate
        // This will be implemented when we add the algorithm modules
        console.log(`Visualizing ${this.currentAlgorithm} algorithm`);
        
        // For now, re-enable controls after a delay (placeholder)
        setTimeout(() => {
            this.setControlsEnabled(true);
            this.board.setAnimating(false);
            this.isVisualizing = false;
        }, 1000);
    }

    /**
     * Handle clear path button click
     */
    onClearPath() {
        if (this.isVisualizing) return;
        this.board.clearPath();
    }

    /**
     * Handle clear walls button click
     */
    onClearWalls() {
        if (this.isVisualizing) return;
        this.board.clearWalls();
    }

    /**
     * Handle clear board button click
     */
    onClearBoard() {
        if (this.isVisualizing) return;
        this.board.clearBoard();
    }

    /**
     * Handle maze selection
     * @param {string} mazeType - Selected maze type
     */
    onMazeSelect(mazeType) {
        if (!mazeType || this.isVisualizing) return;
        
        // Reset maze select
        const mazeSelect = document.getElementById('maze-select');
        if (mazeSelect) {
            mazeSelect.value = '';
        }
        
        // TODO: Generate maze based on type
        console.log(`Generating ${mazeType} maze`);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize handler
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (!this.isVisualizing) {
                const dimensions = Board.calculateDimensions(this.gridContainer);
                if (dimensions.rows !== this.board.rows || dimensions.cols !== this.board.cols) {
                    // Recreate board with new dimensions
                    this.board.clearBoard();
                }
            }
        }, 250);
    }

    /**
     * Enable/disable UI controls
     * @param {boolean} enabled - Whether controls should be enabled
     */
    setControlsEnabled(enabled) {
        this.visualizeBtn.disabled = !enabled || !this.currentAlgorithm;
        this.clearPathBtn.disabled = !enabled;
        this.clearWallsBtn.disabled = !enabled;
        this.clearBoardBtn.disabled = !enabled;
        this.algorithmSelect.disabled = !enabled;
        this.speedSelect.disabled = !enabled;
    }

    /**
     * Update algorithm description text
     * @param {string} algorithm - Algorithm name
     */
    updateAlgorithmInfo(algorithm) {
        const descriptions = {
            'dijkstra': "Dijkstra's Algorithm is a weighted pathfinding algorithm that guarantees the shortest path. It explores all possible paths uniformly.",
            'astar': "A* Search is a weighted, heuristic-based algorithm that guarantees the shortest path. It's faster than Dijkstra's by prioritizing promising paths.",
            'bfs': "Breadth-First Search is an unweighted algorithm that explores level by level. It guarantees the shortest path for unweighted graphs.",
            'dfs': "Depth-First Search is an unweighted algorithm that explores as far as possible before backtracking. It does not guarantee the shortest path.",
            '': 'Select an algorithm to begin visualization'
        };

        if (this.algorithmInfo) {
            this.algorithmInfo.textContent = descriptions[algorithm] || descriptions[''];
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PathfindingVisualizer();
    app.init();
    
    // Make app globally accessible for debugging
    window.pathfindingApp = app;
});
