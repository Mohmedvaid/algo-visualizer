# Architecture Overview

## Reference Project Analysis

Based on the reference project, here are the key architectural decisions and patterns:

### Core Components

1. **Node Class** (`node.js`)
   - Represents a single cell in the grid
   - Properties: id, status, previousNode, distance, weight, etc.
   - Handles both weighted and unweighted algorithms

2. **Board Class** (`board.js`)
   - Manages the entire grid and state
   - Handles grid creation, user interactions, and algorithm orchestration
   - Manages animation queues and node state updates

3. **Algorithm Modules**
   - Separated into weighted and unweighted algorithms
   - Algorithms populate an animation queue during execution
   - Return success/failure status

4. **Animation System**
   - Uses setTimeout-based sequential animation
   - Separate animation modules for different visualization types
   - Configurable speed settings

### Key Design Decisions

1. **Grid Representation**
   - 2D array (`boardArray`) for algorithm logic
   - HTML table for visual representation
   - Node objects stored in a hash map (`nodes`) for O(1) access

2. **State Management**
   - Board instance maintains all state
   - Node status determines visual appearance
   - Clear separation between algorithm logic and visualization

3. **User Interaction**
   - Mouse events for drawing walls and dragging nodes
   - Keyboard events for special modes (e.g., weight placement)
   - Event listeners attached to each grid cell

### Our Implementation Approach

**Modern Improvements:**
- Use CSS Grid or Flexbox instead of HTML table
- ES6+ classes and modules
- More modular component structure
- Cleaner separation of concerns
- Modern, minimalist UI (monochrome, no colors)

**Maintained Concepts:**
- Node-based grid system
- Animation queue pattern
- Algorithm modularity
- State-driven rendering

## Project Structure

```
algo-visualizer/
├── public/
│   ├── css/
│   │   └── styles.css          # Modern, minimal styling
│   ├── js/
│   │   ├── board.js            # Main Board class
│   │   ├── node.js             # Node class
│   │   ├── animations.js       # Animation system
│   │   ├── utils.js            # Helper functions
│   │   └── algorithms/
│   │       ├── dijkstra.js
│   │       ├── astar.js
│   │       ├── bfs.js
│   │       └── dfs.js
│   └── index.html              # Single page app
├── server.js                   # Express server
├── package.json
└── README.md
```

## Animation Strategy

1. **Algorithm Execution**: Algorithms build an array of nodes to animate
2. **Visualization Loop**: Sequential animation with configurable delays
3. **State Transitions**: CSS classes represent node states (unvisited, visiting, visited, path, wall)
4. **Path Reconstruction**: Trace back from target using `previousNode` references

## Node States

- `unvisited`: Default state, white/light gray
- `wall`: Impassable barrier
- `visiting`: Currently being explored (animated)
- `visited`: Already explored
- `path`: Part of shortest path
- `start`: Starting position
- `target`: Goal position

## Color Strategy

**Reference uses colors**, but our implementation will use:
- **Monochrome palette**: Grayscale with pattern/texture differentiation
- **Visual distinction**: Different border styles, opacity, or patterns instead of colors
- **Accessibility**: High contrast for readability
- **Modern aesthetic**: Clean, minimalist design

