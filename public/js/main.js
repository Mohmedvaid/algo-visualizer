import { Board } from './board.js';
import { bfs, dfs, dijkstra, aStar } from './algorithms/index.js';
import { Animator } from './animations.js';
import { generateRandomMaze, generateRecursiveDivisionAdaptive } from './mazes/index.js';

/**
 * Main application controller
 * Initializes and manages the pathfinding visualizer
 */
class PathfindingVisualizer {
    constructor() {
        this.board = null;
        this.currentAlgorithm = null;
        this.animator = null;
        
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
        
        // Initialize animator
        this.animator = new Animator(this.board, this.animationSpeed);
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
            if (this.animator) {
                this.animator.setSpeed(this.animationSpeed);
            }
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
    async onVisualizeClick() {
        if (!this.currentAlgorithm || this.isVisualizing) {
            return;
        }

        // Clear previous visualization
        this.board.clearPath();
        
        // Disable controls during visualization
        this.setControlsEnabled(false);
        this.isVisualizing = true;

        try {
            // Get start and target nodes
            const startNode = this.board.getStartNode();
            const targetNode = this.board.getTargetNode();

            if (!startNode || !targetNode) {
                console.error('Start or target node not found');
                return;
            }

            // Run the selected algorithm
            const result = this.runAlgorithm(
                this.currentAlgorithm,
                startNode,
                targetNode
            );

            if (!result) {
                console.error('Algorithm failed to run');
                return;
            }

            // Animate the results
            await this.animator.animateAlgorithm(
                result.visitedNodes,
                result.path,
                result.success
            );

        } catch (error) {
            console.error('Visualization error:', error);
        } finally {
            // Re-enable controls
            this.setControlsEnabled(true);
            this.isVisualizing = false;
        }
    }

    /**
     * Run the selected pathfinding algorithm
     * @param {string} algorithmName - Name of the algorithm to run
     * @param {Node} startNode - Start node
     * @param {Node} targetNode - Target node
     * @returns {{visitedNodes: Node[], path: Node[], success: boolean}|null}
     */
    runAlgorithm(algorithmName, startNode, targetNode) {
        const grid = this.board.grid;

        try {
            switch (algorithmName) {
                case 'bfs':
                    return bfs(grid, startNode, targetNode);
                
                case 'dfs':
                    return dfs(grid, startNode, targetNode);
                
                case 'dijkstra':
                    return dijkstra(grid, startNode, targetNode);
                
                case 'astar':
                    return aStar(grid, startNode, targetNode);
                
                default:
                    console.error(`Unknown algorithm: ${algorithmName}`);
                    return null;
            }
        } catch (error) {
            console.error(`Error running ${algorithmName}:`, error);
            return null;
        }
    }

    /**
     * Handle clear path button click
     */
    onClearPath() {
        if (this.isVisualizing) {
            // Stop any ongoing animation
            if (this.animator) {
                this.animator.stop();
            }
            this.isVisualizing = false;
            this.setControlsEnabled(true);
        }
        this.board.clearPath();
    }

    /**
     * Handle clear walls button click
     */
    onClearWalls() {
        if (this.isVisualizing) {
            if (this.animator) {
                this.animator.stop();
            }
            this.isVisualizing = false;
            this.setControlsEnabled(true);
        }
        this.board.clearWalls();
    }

    /**
     * Handle clear board button click
     */
    onClearBoard() {
        if (this.isVisualizing) {
            if (this.animator) {
                this.animator.stop();
            }
            this.isVisualizing = false;
            this.setControlsEnabled(true);
        }
        this.board.clearBoard();
    }

    /**
     * Handle maze selection
     * @param {string} mazeType - Selected maze type
     */
    async onMazeSelect(mazeType) {
        if (!mazeType || this.isVisualizing) return;
        
        // Reset maze select
        const mazeSelect = document.getElementById('maze-select');
        if (mazeSelect) {
            mazeSelect.value = '';
        }
        
        // Clear previous visualization
        this.board.clearWalls();
        
        // Disable controls during maze generation
        this.setControlsEnabled(false);
        this.board.setAnimating(true);
        
        try {
            switch (mazeType) {
                case 'random':
                    await generateRandomMaze(this.board, 0.3);
                    break;
                
                case 'recursive-division':
                    await generateRecursiveDivisionAdaptive(this.board);
                    break;
                
                default:
                    console.error(`Unknown maze type: ${mazeType}`);
            }
        } catch (error) {
            console.error('Maze generation error:', error);
        } finally {
            // Re-enable controls
            this.setControlsEnabled(true);
            this.board.setAnimating(false);
        }
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
