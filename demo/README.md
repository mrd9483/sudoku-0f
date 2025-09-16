# 16x16 Sudoku Generator Demo

This demo showcases the 16x16 Sudoku generator using a modern web interface. The Sudoku uses hexadecimal digits (0-F) instead of the traditional 1-9.

## Features

### Grid Generation
- **Complete Grid**: Generate a fully solved 16x16 Sudoku grid
- **Puzzle Mode**: Generate solvable puzzles with two difficulty systems:

#### Traditional Difficulty (Empty Cells)
  - Easy: 60-80 empty cells
  - Medium: 80-100 empty cells  
  - Hard: 100-120 empty cells
  - Expert: 120-140 empty cells

#### Technique-Based Difficulty (Realistic)
  - **Easy**: Only naked/hidden singles needed
  - **Medium**: Basic pairs and intersection techniques
  - **Hard**: Complex patterns, multiple technique chains
  - **Expert**: Advanced techniques, systematic notation

### Interactive Features
- **Click to select cells** and use keyboard to input values (0-F)
- **Arrow key navigation** to move between cells
- **Visual feedback** with different cell types:
  - Given cells (blue) - cannot be edited
  - User input cells (orange) - can be edited
  - Error cells (red) - conflicting values
- **Compact display mode** for smaller screens

### Validation & Solving
- **Validate grid** to check for errors and conflicts
- **Show solution** for generated puzzles
- **Error highlighting** to identify conflicting cells
- **Technique analysis** shows which solving techniques are required

### Hex Representation
- **Hex output** showing the grid in hexadecimal format
- **Load from hex** to import grids from hex strings
- Uses dots (.) for empty cells and 0-F for values 1-16

## How to Use

1. **Open `index.html`** in a web browser
2. **Choose mode**:
   - Complete Grid: Generates a fully solved grid
   - Puzzle: Generates a puzzle with empty cells
3. **Select difficulty** (for puzzle mode)
4. **Choose difficulty type** (for puzzle mode):
   - Traditional: Based on number of empty cells
   - Technique-based: Based on required solving techniques
5. **Click Generate** to create a new grid/puzzle
6. **Interact with the grid**:
   - Click cells to select them
   - Type 0-F to input values
   - Use arrow keys to navigate
7. **Use validation** to check your progress
8. **View technique analysis** (for technique-based puzzles) to see required solving methods
9. **View hex representation** in the text area below

## Technical Details

The demo uses the actual compiled JavaScript from your TypeScript library (`../dist/index.browser.js`):

- **Backtracking solver** with randomized number selection
- **Constraint validation** for rows, columns, and 4x4 boxes
- **Puzzle generation** by removing cells from complete solutions
- **Hex encoding/decoding** for grid representation
- **All the same algorithms** as your CLI tool and library

## Browser Compatibility

Works in all modern browsers that support:
- ES6 classes and arrow functions
- CSS Grid
- Flexbox
- Modern JavaScript APIs

## File Structure

```
demo/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── sudoku-demo.js      # JavaScript implementation
└── README.md          # This file
```

## Development

To modify the demo:
1. Edit `sudoku-demo.js` for functionality changes
2. Edit `styles.css` for visual changes
3. Edit `index.html` for structure changes

The demo loads and uses the actual compiled JavaScript from your TypeScript library, ensuring 100% compatibility with your CLI tool and library functionality.
