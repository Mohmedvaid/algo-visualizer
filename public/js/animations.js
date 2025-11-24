/**
 * Animation system for visualizing pathfinding algorithms
 * 
 * Provides smooth, configurable animations for:
 * - Visiting nodes (algorithm exploration)
 * - Showing the shortest path
 * - Different animation speeds
 */

/**
 * Animation speed presets (delay in milliseconds between node animations)
 */
const ANIMATION_SPEEDS = {
    fast: 5,      // Very fast
    medium: 25,   // Medium speed
    slow: 100     // Slow and visible
};

/**
 * Animator class handles all visualization animations
 */
export class Animator {
    /**
     * Creates a new Animator instance
     * @param {Board} board - Board instance to animate on
     * @param {string} speed - Animation speed ('fast', 'medium', 'slow')
     */
    constructor(board, speed = 'medium') {
        this.board = board;
        this.speed = ANIMATION_SPEEDS[speed] || ANIMATION_SPEEDS.medium;
        this.isAnimating = false;
        this.animationQueue = [];
        this.currentTimeout = null;
    }

    /**
     * Animate algorithm execution
     * @param {Node[]} visitedNodes - Nodes visited during algorithm execution
     * @param {Node[]} path - Shortest path nodes
     * @param {boolean} success - Whether a path was found
     * @returns {Promise<boolean>} - Promise that resolves when animation completes
     */
    async animateAlgorithm(visitedNodes, path, success) {
        if (this.isAnimating) {
            console.warn('Animation already in progress');
            return false;
        }

        this.isAnimating = true;
        this.board.setAnimating(true);

        try {
            // Animate visited nodes
            await this.animateVisitedNodes(visitedNodes);
            
            // Animate path if found
            if (success && path.length > 0) {
                await this.animatePath(path);
            }
            
            return success;
        } catch (error) {
            console.error('Animation error:', error);
            return false;
        } finally {
            this.isAnimating = false;
            this.board.setAnimating(false);
        }
    }

    /**
     * Animate nodes being visited by the algorithm
     * @param {Node[]} visitedNodes - Array of nodes to animate
     * @returns {Promise<void>}
     */
    animateVisitedNodes(visitedNodes) {
        return new Promise((resolve) => {
            if (visitedNodes.length === 0) {
                resolve();
                return;
            }

            let index = 0;
            
            const animateNext = () => {
                // Check if animation was stopped
                if (!this.isAnimating) {
                    resolve();
                    return;
                }

                if (index >= visitedNodes.length) {
                    resolve();
                    return;
                }

                const node = visitedNodes[index];
                
                // Skip animating start and target nodes
                if (!node.isStart() && !node.isTarget()) {
                    this.updateNodeVisual(node, 'visiting');
                    
                    // After a brief delay, mark as visited
                    setTimeout(() => {
                        if (this.isAnimating) {
                            this.updateNodeVisual(node, 'visited');
                        }
                    }, this.speed / 2);
                }

                index++;
                if (this.isAnimating) {
                    this.currentTimeout = setTimeout(animateNext, this.speed);
                }
            };

            animateNext();
        });
    }

    /**
     * Animate the shortest path
     * @param {Node[]} path - Array of nodes in the path
     * @returns {Promise<void>}
     */
    animatePath(path) {
        return new Promise((resolve) => {
            if (path.length === 0) {
                resolve();
                return;
            }

            let index = 0;
            const pathDelay = Math.max(this.speed / 2, 10); // Path animation should be slightly faster
            
            const animateNext = () => {
                // Check if animation was stopped
                if (!this.isAnimating) {
                    resolve();
                    return;
                }

                if (index >= path.length) {
                    resolve();
                    return;
                }

                const node = path[index];
                this.updateNodeVisual(node, 'path');
                
                index++;
                if (this.isAnimating) {
                    this.currentTimeout = setTimeout(animateNext, pathDelay);
                }
            };

            animateNext();
        });
    }

    /**
     * Update visual state of a node
     * @param {Node} node - Node to update
     * @param {string} status - New visual status
     */
    updateNodeVisual(node, status) {
        const element = document.getElementById(node.id);
        if (!element) return;

        // Remove existing status classes
        element.classList.remove(
            'node-visiting',
            'node-visited',
            'node-path',
            'node-unvisited'
        );

        // Add new status class
        element.classList.add(`node-${status}`);
        
        // Update node's visual state
        if (status === 'visiting' || status === 'visited') {
            node.isVisited = true;
        } else if (status === 'path') {
            node.isInPath = true;
        }
    }

    /**
     * Stop current animation
     */
    stop() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        this.isAnimating = false;
        this.animationQueue = [];
        if (this.board) {
            this.board.setAnimating(false);
        }
    }

    /**
     * Set animation speed
     * @param {string} speed - Speed preset ('fast', 'medium', 'slow')
     */
    setSpeed(speed) {
        this.speed = ANIMATION_SPEEDS[speed] || ANIMATION_SPEEDS.medium;
    }
}

/**
 * Instant animation (no delays) for quick visualization
 * Useful for testing or when speed is set to maximum
 */
export class InstantAnimator {
    /**
     * Creates a new InstantAnimator instance
     * @param {Board} board - Board instance
     */
    constructor(board) {
        this.board = board;
    }

    /**
     * Instantly animate algorithm results (no delays)
     * @param {Node[]} visitedNodes - Nodes visited during algorithm execution
     * @param {Node[]} path - Shortest path nodes
     * @param {boolean} success - Whether a path was found
     */
    animateAlgorithm(visitedNodes, path, success) {
        // Instantly mark all visited nodes
        for (const node of visitedNodes) {
            if (!node.isStart() && !node.isTarget()) {
                const element = document.getElementById(node.id);
                if (element) {
                    element.classList.remove('node-unvisited');
                    element.classList.add('node-visited');
                }
            }
        }

        // Instantly show path
        if (success && path.length > 0) {
            for (const node of path) {
                const element = document.getElementById(node.id);
                if (element) {
                    element.classList.remove('node-visited');
                    element.classList.add('node-path');
                }
            }
        }
    }
}

