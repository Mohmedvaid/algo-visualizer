/**
 * Maze generation module exports
 * Provides centralized access to all maze generation algorithms
 */

export { generateRandomMaze } from './randomMaze.js';
export { generateRecursiveDivision, generateRecursiveDivisionAdaptive } from './recursiveDivision.js';

/**
 * Maze generation metadata
 */
export const mazeMetadata = {
    random: {
        name: 'Random Maze',
        description: 'Generates a random maze with configurable wall density',
        animated: true
    },
    'recursive-division': {
        name: 'Recursive Division',
        description: 'Creates a perfect maze using recursive division algorithm',
        animated: true
    }
};

