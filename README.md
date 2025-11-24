# Pathfinding Algorithm Visualizer

A modern, minimalist web-based pathfinding algorithm visualizer built for portfolio demonstration. This single-page application provides an interactive way to visualize and understand various pathfinding algorithms including Dijkstra's, A*, Breadth-First Search, and Depth-First Search.

## Features

- **Multiple Algorithms**: Visualize different pathfinding algorithms including:
  - Dijkstra's Algorithm (weighted, guarantees shortest path)
  - A* Search (weighted, heuristic-based)
  - Breadth-First Search (unweighted)
  - Depth-First Search (unweighted)

- **Interactive Grid**: 
  - Click and drag to place walls
  - Move start and target nodes
  - Generate random mazes

- **Clean, Modern UI**: Minimalist monochrome design focused on clarity and usability

- **Real-time Visualization**: Watch algorithms execute step-by-step with smooth animations

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express
- **Architecture**: Client-side rendering with server for static file serving

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd algo-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Development

For development with auto-reload:
```bash
npm run dev
```

## Project Structure

```
algo-visualizer/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── board.js
│   │   ├── node.js
│   │   ├── algorithms/
│   │   └── animations.js
│   └── index.html
├── server.js
├── package.json
└── README.md
```

## Usage

1. **Select an Algorithm**: Choose from the dropdown menu in the navbar
2. **Customize the Grid**: 
   - Click to add/remove walls
   - Drag the start (circle) and target (square) nodes
3. **Visualize**: Click the "Visualize" button to see the algorithm in action
4. **Clear**: Use the clear buttons to reset walls, paths, or the entire board

## Algorithms Explained

- **Dijkstra's Algorithm**: Explores all possible paths uniformly, guaranteed to find the shortest path
- **A* Search**: Uses heuristics to prioritize promising paths, faster than Dijkstra's
- **BFS**: Explores level by level, guaranteed shortest path for unweighted graphs
- **DFS**: Explores as far as possible before backtracking, doesn't guarantee shortest path

## License

MIT License

## Credits

Built as a portfolio project demonstrating algorithm visualization and modern web development practices.
