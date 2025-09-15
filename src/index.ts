export interface SudokuGrid {
    grid: number[][];
    isValid: boolean;
    generationTime: number;
}

export interface GenerationOptions {
    seed?: number;
    maxAttempts?: number;
}

export class Sudoku16Generator {
    private readonly SIZE = 16;
    private readonly BOX_SIZE = 4;
    private grid: number[][];
    
    constructor() {
        this.grid = this.createEmptyGrid();
    }
    
    private createEmptyGrid(): number[][] {
        return Array(this.SIZE).fill(null).map(() => Array(this.SIZE).fill(0));
    }
    
    private isValid(row: number, col: number, num: number): boolean {
        // Check row
        for (let x = 0; x < this.SIZE; x++) {
            if (this.grid[row][x] === num) {
                return false;
            }
        }
        
        // Check column
        for (let x = 0; x < this.SIZE; x++) {
            if (this.grid[x][col] === num) {
                return false;
            }
        }
        
        // Check 4x4 box
        const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
        const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;
        
        for (let i = 0; i < this.BOX_SIZE; i++) {
            for (let j = 0; j < this.BOX_SIZE; j++) {
                if (this.grid[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    private solve(): boolean {
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (this.grid[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
                    
                    for (const num of numbers) {
                        if (this.isValid(row, col, num)) {
                            this.grid[row][col] = num;
                            
                            if (this.solve()) {
                                return true;
                            }
                            
                            this.grid[row][col] = 0;
                        }
                    }
                    
                    return false;
                }
            }
        }
        return true;
    }
    
    public generate(options: GenerationOptions = {}): SudokuGrid {
        const startTime = Date.now();
        const maxAttempts = options.maxAttempts || 1;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            this.grid = this.createEmptyGrid();
            
            if (this.solve()) {
                const endTime = Date.now();
                return {
                    grid: this.grid.map(row => [...row]),
                    isValid: this.validateGrid(),
                    generationTime: endTime - startTime
                };
            }
        }
        
        // Failed to generate
        const endTime = Date.now();
        return {
            grid: this.createEmptyGrid(),
            isValid: false,
            generationTime: endTime - startTime
        };
    }
    
    public validateGrid(grid?: number[][]): boolean {
        const gridToValidate = grid || this.grid;
        
        // Check if all cells are filled
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                if (gridToValidate[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // Check constraints
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                const num = gridToValidate[i][j];
                const originalGrid = this.grid;
                this.grid = gridToValidate;
                
                // Temporarily clear cell
                gridToValidate[i][j] = 0;
                
                if (!this.isValid(i, j, num)) {
                    gridToValidate[i][j] = num;
                    this.grid = originalGrid;
                    return false;
                }
                
                gridToValidate[i][j] = num;
                this.grid = originalGrid;
            }
        }
        
        return true;
    }
    
    public static printGrid(grid: number[][], options: { compact?: boolean } = {}): string {
        const { compact = false } = options;
        
        let output = '';
        
        if (!compact) {
            output += '  ' + Array.from({length: 16}, (_, i) => i.toString(16).toUpperCase()).join(' ') + '\n';
            output += '  ' + '-'.repeat(32) + '\n';
        }
        
        for (let i = 0; i < 16; i++) {
            if (!compact) {
                output += i.toString(16).toUpperCase() + '|';
            }
            
            for (let j = 0; j < 16; j++) {
                const value = grid[i][j];
                const hexValue = value === 0 ? '.' : (value - 1).toString(16).toUpperCase();
                output += hexValue;
                
                if (!compact && j < 15) {
                    output += ' ';
                }
            }
            
            output += '\n';
            
            // Add horizontal separator every 4 rows
            if (!compact && (i + 1) % 4 === 0 && i < 15) {
                output += '  ' + '-'.repeat(32) + '\n';
            }
        }
        
        return output;
    }
    
    public static gridToHex(grid: number[][]): string {
        return grid.map(row => 
            row.map(cell => cell === 0 ? '.' : (cell - 1).toString(16).toUpperCase()).join('')
        ).join('\n');
    }
    
    public static hexToGrid(hexString: string): number[][] {
        const lines = hexString.trim().split('\n');
        if (lines.length !== 16) {
            throw new Error('Invalid hex string: must have exactly 16 lines');
        }
        
        return lines.map(line => {
            if (line.length !== 16) {
                throw new Error('Invalid hex string: each line must have exactly 16 characters');
            }
            
            return Array.from(line).map(char => {
                if (char === '.') return 0;
                const num = parseInt(char, 16);
                if (isNaN(num) || num < 0 || num > 15) {
                    throw new Error(`Invalid hex character: ${char}`);
                }
                return num + 1;
            });
        });
    }
}

// Convenience functions
export function generateSudoku16(options?: GenerationOptions): SudokuGrid {
    const generator = new Sudoku16Generator();
    return generator.generate(options);
}

export function printSudoku16(grid: number[][], compact = false): void {
    console.log(Sudoku16Generator.printGrid(grid, { compact }));
}

export function validateSudoku16(grid: number[][]): boolean {
    const generator = new Sudoku16Generator();
    return generator.validateGrid(grid);
}