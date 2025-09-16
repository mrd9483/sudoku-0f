// README.md
# Sudoku-0F

A fast 16x16 Sudoku generator for Node.js with TypeScript support.

## Features

- Generate complete 16x16 Sudoku grids
- Generate solvable puzzles with empty cells (4 difficulty levels)
- Hex display (0-F) for compact representation
- TypeScript support with full type definitions
- Command-line interface with puzzle generation
- Grid validation and puzzle solvability verification
- Hex string conversion utilities

## Installation

```bash
npm install sudoku-0f
```

## Browser Usage

For browser usage, the package includes a browser-compatible build:

```html
<script src="node_modules/sudoku-0f/dist/index.browser.js"></script>
<script>
  // All functions are available globally
  const puzzle = generateSudokuPuzzle({ difficulty: 'medium' });
  console.log('Empty cells:', puzzle.emptyCells);
</script>
```

Or with a module bundler:

```javascript
import { generateSudoku16, generateSudokuPuzzle } from 'sudoku-0f/dist/index.browser.js';
```

## Usage

### Basic Generation

```typescript
import { generateSudoku16, printSudoku16 } from 'sudoku-0f';

const result = generateSudoku16();
if (result.isValid) {
    printSudoku16(result.grid);
    console.log(`Generated in ${result.generationTime}ms`);
}
```

### Puzzle Generation

```typescript
import { generateSudokuPuzzle, printSudokuPuzzle } from 'sudoku-0f';

// Generate a medium difficulty puzzle
const puzzle = generateSudokuPuzzle({ difficulty: 'medium' });
if (puzzle.isValid) {
    printSudokuPuzzle(puzzle);
    console.log(`Empty cells: ${puzzle.emptyCells}`);
}
```

### Class-based Usage

```typescript
import { Sudoku16Generator } from 'sudoku-0f';

const generator = new Sudoku16Generator();

// Generate complete grid
const result = generator.generate();

// Generate puzzle
const puzzle = generator.generatePuzzle({ difficulty: 'hard' });

// Print with different options
console.log(Sudoku16Generator.printGrid(result.grid, { compact: true }));
```

### Hex Conversion

```typescript
import { Sudoku16Generator } from 'sudoku-0f';

const grid = /* your 16x16 grid */;

// Convert to hex string
const hexString = Sudoku16Generator.gridToHex(grid);

// Convert back to grid
const restoredGrid = Sudoku16Generator.hexToGrid(hexString);
```

### Command Line

```bash
# Generate complete grids
npx sudoku-0f                    # Generate 1 complete grid
npx sudoku-0f 3                  # Generate 3 complete grids
npx sudoku-0f 1 --compact        # Generate 1 grid (compact display)

# Generate puzzles
npx sudoku-0f puzzle                    # Generate 1 medium puzzle
npx sudoku-0f puzzle easy 2             # Generate 2 easy puzzles
npx sudoku-0f puzzle hard --compact     # Generate 1 hard puzzle (compact)
npx sudoku-0f puzzle expert --solution  # Generate 1 expert puzzle with solution

# Show help
npx sudoku-0f --help
```

**Difficulty Levels:**
- `easy`: ~60-80 empty cells
- `medium`: ~80-100 empty cells (default)
- `hard`: ~100-120 empty cells  
- `expert`: ~120-140 empty cells

## API Reference

### `generateSudoku16(options?): SudokuGrid`

Generate a complete 16x16 Sudoku grid.

**Parameters:**
- `options.maxAttempts` (number): Maximum generation attempts (default: 1)

**Returns:**
- `grid`: 16x16 array of numbers (1-16, 0 for empty)
- `isValid`: boolean indicating if generation succeeded
- `generationTime`: generation time in milliseconds

### `generateSudokuPuzzle(options?): SudokuPuzzle`

Generate a solvable 16x16 Sudoku puzzle with empty cells.

**Parameters:**
- `options.difficulty` (string): 'easy', 'medium', 'hard', or 'expert' (default: 'medium')
- `options.maxAttempts` (number): Maximum generation attempts (default: 10)

**Returns:**
- `puzzle`: 16x16 array with empty cells (0)
- `solution`: Complete solution grid
- `difficulty`: Difficulty level used
- `isValid`: boolean indicating if generation succeeded
- `generationTime`: generation time in milliseconds
- `emptyCells`: number of empty cells in the puzzle

### `Sudoku16Generator.printGrid(grid, options?): string`

Format a grid for display.

**Parameters:**
- `grid`: 16x16 number array
- `options.compact`: boolean for compact display (default: false)

### `printSudokuPuzzle(puzzle, showSolution?, compact?): void`

Print a puzzle with optional solution display.

**Parameters:**
- `puzzle`: SudokuPuzzle object
- `showSolution`: boolean to show solution (default: false)
- `compact`: boolean for compact display (default: false)

### `validateSudoku16(grid): boolean`

Validate a 16x16 Sudoku grid.

## Performance

Typical generation times: 1-20ms on modern hardware.

## License

MIT