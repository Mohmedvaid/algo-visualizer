/**
 * Random Maze Generator
 * 
 * Generates a random maze by randomly placing walls across the grid.
 * Uses a configurable wall density to control maze difficulty.
 */

/**
 * Generate a random maze on the board
 * @param {Board} board - Board instance
 * @param {number} wallDensity - Probability of a cell being a wall (0-1), default 0.3
 * @returns {Promise<void>} - Resolves when maze generation is complete
 */
export async function generateRandomMaze(board, wallDensity = 0.3) {
    // Clear existing walls first
    board.clearWalls();
    
    const grid = board.grid;
    const rows = board.rows;
    const cols = board.cols;
    const startNode = board.getStartNode();
    const targetNode = board.getTargetNode();
    
    // Collect all nodes that can be turned into walls
    const nodesToProcess = [];
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const node = grid[row][col];
            
            // Skip start, target, and existing walls
            if (!node.isStart() && !node.isTarget() && node.status !== 'wall') {
                nodesToProcess.push(node);
            }
        }
    }
    
    // Shuffle array for randomness
    shuffleArray(nodesToProcess);
    
    // Calculate number of walls to place
    const numWalls = Math.floor(nodesToProcess.length * wallDensity);
    
    // Place walls with animation
    for (let i = 0; i < numWalls; i++) {
        const node = nodesToProcess[i];
        board.updateNodeVisual(node, 'wall');
        
        // Small delay for visual effect (can be removed for instant generation)
        if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

