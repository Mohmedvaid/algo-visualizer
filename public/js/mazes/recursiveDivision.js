/**
 * Recursive Division Maze Generator
 * 
 * Creates a perfect maze using recursive division algorithm.
 * The algorithm works by recursively dividing the grid with walls,
 * creating a maze that has exactly one path between any two points.
 */

/**
 * Generate a recursive division maze on the board
 * @param {Board} board - Board instance
 * @returns {Promise<void>} - Resolves when maze generation is complete
 */
export async function generateRecursiveDivision(board) {
    // Clear existing walls first
    board.clearWalls();
    
    const grid = board.grid;
    const rows = board.rows;
    const cols = board.cols;
    
    // Initialize all cells as open (not walls)
    // This is already done by clearWalls()
    
    // Build walls around the border
    buildBorderWalls(board);
    
    // Recursively divide the interior
    await recursiveDivide(
        board,
        grid,
        1,           // Start row (leave border)
        rows - 2,    // End row (leave border)
        1,           // Start col (leave border)
        cols - 2     // End col (leave border)
    );
}

/**
 * Build walls around the border of the grid
 * @param {Board} board - Board instance
 */
function buildBorderWalls(board) {
    const rows = board.rows;
    const cols = board.cols;
    const grid = board.grid;
    
    // Top and bottom borders
    for (let col = 0; col < cols; col++) {
        const topNode = grid[0][col];
        const bottomNode = grid[rows - 1][col];
        
        if (!topNode.isStart() && !topNode.isTarget()) {
            board.updateNodeVisual(topNode, 'wall');
        }
        if (!bottomNode.isStart() && !bottomNode.isTarget()) {
            board.updateNodeVisual(bottomNode, 'wall');
        }
    }
    
    // Left and right borders
    for (let row = 0; row < rows; row++) {
        const leftNode = grid[row][0];
        const rightNode = grid[row][cols - 1];
        
        if (!leftNode.isStart() && !leftNode.isTarget()) {
            board.updateNodeVisual(leftNode, 'wall');
        }
        if (!rightNode.isStart() && !rightNode.isTarget()) {
            board.updateNodeVisual(rightNode, 'wall');
        }
    }
}

/**
 * Recursively divide the grid to create a maze
 * @param {Board} board - Board instance
 * @param {Node[][]} grid - 2D grid array
 * @param {number} rowStart - Starting row index
 * @param {number} rowEnd - Ending row index
 * @param {number} colStart - Starting column index
 * @param {number} colEnd - Ending column index
 * @returns {Promise<void>}
 */
async function recursiveDivide(board, grid, rowStart, rowEnd, colStart, colEnd) {
    // Base case: area too small to divide
    if (rowEnd - rowStart < 2 || colEnd - colStart < 2) {
        return;
    }
    
    const height = rowEnd - rowStart + 1;
    const width = colEnd - colStart + 1;
    
    // Determine orientation: horizontal or vertical
    // Prefer wider divisions
    const horizontal = height > width;
    
    if (horizontal) {
        // Horizontal division
        // Choose a random row (must be odd to allow paths)
        const wallRow = rowStart + Math.floor(Math.random() * Math.floor(height / 2)) * 2;
        
        // Build wall
        for (let col = colStart; col <= colEnd; col++) {
            const node = grid[wallRow][col];
            if (!node.isStart() && !node.isTarget()) {
                board.updateNodeVisual(node, 'wall');
            }
        }
        
        // Create a passage (hole) in the wall
        const passageCol = colStart + Math.floor(Math.random() * Math.ceil(width / 2)) * 2;
        const passageNode = grid[wallRow][passageCol];
        if (passageNode.status === 'wall') {
            board.updateNodeVisual(passageNode, 'unvisited');
        }
        
        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Recursively divide the two regions
        await recursiveDivide(board, grid, rowStart, wallRow - 1, colStart, colEnd);
        await recursiveDivide(board, grid, wallRow + 1, rowEnd, colStart, colEnd);
        
    } else {
        // Vertical division
        // Choose a random column (must be odd to allow paths)
        const wallCol = colStart + Math.floor(Math.random() * Math.floor(width / 2)) * 2;
        
        // Build wall
        for (let row = rowStart; row <= rowEnd; row++) {
            const node = grid[row][wallCol];
            if (!node.isStart() && !node.isTarget()) {
                board.updateNodeVisual(node, 'wall');
            }
        }
        
        // Create a passage (hole) in the wall
        const passageRow = rowStart + Math.floor(Math.random() * Math.ceil(height / 2)) * 2;
        const passageNode = grid[passageRow][wallCol];
        if (passageNode.status === 'wall') {
            board.updateNodeVisual(passageNode, 'unvisited');
        }
        
        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Recursively divide the two regions
        await recursiveDivide(board, grid, rowStart, rowEnd, colStart, wallCol - 1);
        await recursiveDivide(board, grid, rowStart, rowEnd, wallCol + 1, colEnd);
    }
}

/**
 * Alternative recursive division that works better with any grid size
 * This version doesn't require odd-numbered dimensions
 */
export async function generateRecursiveDivisionAdaptive(board) {
    // Clear existing walls first
    board.clearWalls();
    
    const grid = board.grid;
    const rows = board.rows;
    const cols = board.cols;
    
    // Recursively divide the entire grid
    await recursiveDivideAdaptive(
        board,
        grid,
        0,
        rows - 1,
        0,
        cols - 1
    );
}

/**
 * Adaptive recursive division that handles any grid size
 * @param {Board} board - Board instance
 * @param {Node[][]} grid - 2D grid array
 * @param {number} rowStart - Starting row index
 * @param {number} rowEnd - Ending row index
 * @param {number} colStart - Starting column index
 * @param {number} colEnd - Ending column index
 * @returns {Promise<void>}
 */
async function recursiveDivideAdaptive(board, grid, rowStart, rowEnd, colStart, colEnd) {
    const height = rowEnd - rowStart + 1;
    const width = colEnd - colStart + 1;
    
    // Base case: area too small to divide meaningfully
    if (height < 3 || width < 3) {
        return;
    }
    
    // Determine orientation
    const horizontal = height > width || (height === width && Math.random() < 0.5);
    
    if (horizontal && height >= 3) {
        // Horizontal division
        const wallRow = rowStart + Math.floor(Math.random() * (height - 2)) + 1;
        
        // Build wall, but skip start/target nodes
        for (let col = colStart; col <= colEnd; col++) {
            const node = grid[wallRow][col];
            if (!node.isStart() && !node.isTarget() && node.status !== 'wall') {
                board.updateNodeVisual(node, 'wall');
            }
        }
        
        // Create a random passage
        const passageCol = colStart + Math.floor(Math.random() * width);
        const passageNode = grid[wallRow][passageCol];
        if (passageNode.status === 'wall') {
            board.updateNodeVisual(passageNode, 'unvisited');
        }
        
        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 5));
        
        // Recursively divide the two regions
        await recursiveDivideAdaptive(board, grid, rowStart, wallRow - 1, colStart, colEnd);
        await recursiveDivideAdaptive(board, grid, wallRow + 1, rowEnd, colStart, colEnd);
        
    } else if (width >= 3) {
        // Vertical division
        const wallCol = colStart + Math.floor(Math.random() * (width - 2)) + 1;
        
        // Build wall, but skip start/target nodes
        for (let row = rowStart; row <= rowEnd; row++) {
            const node = grid[row][wallCol];
            if (!node.isStart() && !node.isTarget() && node.status !== 'wall') {
                board.updateNodeVisual(node, 'wall');
            }
        }
        
        // Create a random passage
        const passageRow = rowStart + Math.floor(Math.random() * height);
        const passageNode = grid[passageRow][wallCol];
        if (passageNode.status === 'wall') {
            board.updateNodeVisual(passageNode, 'unvisited');
        }
        
        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 5));
        
        // Recursively divide the two regions
        await recursiveDivideAdaptive(board, grid, rowStart, rowEnd, colStart, wallCol - 1);
        await recursiveDivideAdaptive(board, grid, rowStart, rowEnd, wallCol + 1, colEnd);
    }
}

