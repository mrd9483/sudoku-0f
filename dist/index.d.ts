export interface SudokuGrid {
    grid: number[][];
    isValid: boolean;
    generationTime: number;
}
export interface GenerationOptions {
    seed?: number;
    maxAttempts?: number;
}
export declare class Sudoku16Generator {
    private readonly SIZE;
    private readonly BOX_SIZE;
    private grid;
    constructor();
    private createEmptyGrid;
    private isValid;
    private shuffleArray;
    private solve;
    generate(options?: GenerationOptions): SudokuGrid;
    validateGrid(grid?: number[][]): boolean;
    static printGrid(grid: number[][], options?: {
        compact?: boolean;
    }): string;
    static gridToHex(grid: number[][]): string;
    static hexToGrid(hexString: string): number[][];
}
export declare function generateSudoku16(options?: GenerationOptions): SudokuGrid;
export declare function printSudoku16(grid: number[][], compact?: boolean): void;
export declare function validateSudoku16(grid: number[][]): boolean;
//# sourceMappingURL=index.d.ts.map