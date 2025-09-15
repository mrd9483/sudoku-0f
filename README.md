// README.md
# Sudoku-0F

A fast 16x16 Sudoku generator for Node.js with TypeScript support.

## Features

- Generate complete 16x16 Sudoku grids
- Hex display (0-F) for compact representation
- TypeScript support with full type definitions
- Command-line interface
- Grid validation
- Hex string conversion utilities

## Installation

```bash
npm install sudoku-0f
```

## Usage

### Basic Generation

```typescript
import { generateSudoku16, printSudoku16 } from 'sudoku16';

const result = generateSudoku16();
if (result.isValid) {
    printSudoku16(result.grid);
    console.log(`Generated in ${result.generationTime}ms`);
}
```

### Class-based Usage

```typescript
import { Sudoku16Generator } from 'sudoku16';

const generator = new Sudoku16Generator();
const result = generator.generate();

// Print with different options
console.log(Sudoku16Generator.printGrid(result.grid, { compact: true }));
```

### Hex Conversion

```typescript
import { Sudoku16Generator } from 'sudoku16';

const grid = /* your 16x16 grid */;

// Convert to hex string
const hexString = Sudoku16Generator.gridToHex(grid);

// Convert back to grid
const restoredGrid = Sudoku16Generator.hexToGrid(hexString);
```

### Command Line

```bash
# Generate one grid
npx sudoku16

# Generate multiple grids
npx sudoku16 3

# Compact display
npx sudoku16 1 --compact
```

## API Reference

### `generateSudoku16(options?): SudokuGrid`

Generate a complete 16x16 Sudoku grid.

**Parameters:**
- `options.maxAttempts` (number): Maximum generation attempts (default: 1)

**Returns:**
- `grid`: 16x16 array of numbers (1-16, 0 for empty)
- `isValid`: boolean indicating if generation succeeded
- `generationTime`: generation time in milliseconds

### `Sudoku16Generator.printGrid(grid, options?): string`

Format a grid for display.

**Parameters:**
- `grid`: 16x16 number array
- `options.compact`: boolean for compact display (default: false)

### `validateSudoku16(grid): boolean`

Validate a 16x16 Sudoku grid.

## Performance

Typical generation times: 1-20ms on modern hardware.

## License

MIT