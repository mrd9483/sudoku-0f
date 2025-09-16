export interface SudokuGrid {
    grid: number[][];
    isValid: boolean;
    generationTime: number;
}

export interface GenerationOptions {
    seed?: number;
    maxAttempts?: number;
    timeoutMs?: number;
    maxIterations?: number;
}

export interface PuzzleOptions {
    difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
    maxAttempts?: number;
    timeoutMs?: number;
    maxIterations?: number;
    useTechniqueDifficulty?: boolean; // Use technique-based difficulty instead of empty cells
}

export enum SolvingTechnique {
    NAKED_SINGLE = 'naked_single',
    HIDDEN_SINGLE = 'hidden_single',
    NAKED_PAIR = 'naked_pair',
    HIDDEN_PAIR = 'hidden_pair',
    INTERSECTION_REMOVAL = 'intersection_removal',
    NAKED_TRIPLE = 'naked_triple',
    HIDDEN_TRIPLE = 'hidden_triple',
    X_WING = 'x_wing',
    SWORDFISH = 'swordfish',
    XY_WING = 'xy_wing',
    XYZ_WING = 'xyz_wing',
    UNIQUE_RECTANGLE = 'unique_rectangle',
    FORCING_CHAIN = 'forcing_chain',
    NISHIO = 'nishio',
    COLORING = 'coloring',
    MULTI_COLORING = 'multi_coloring'
}

export interface TechniqueAnalysis {
    technique: SolvingTechnique;
    cells: [number, number][];
    candidates: number[];
    description: string;
}

export interface DifficultyAnalysis {
    requiredTechniques: SolvingTechnique[];
    maxTechniqueLevel: number;
    estimatedDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
    solvingSteps: TechniqueAnalysis[];
}

export interface SudokuPuzzle {
    puzzle: number[][];
    solution: number[][];
    difficulty: string;
    isValid: boolean;
    generationTime: number;
    emptyCells: number;
    techniqueAnalysis?: DifficultyAnalysis;
}

export class Sudoku16Generator {
    private readonly SIZE = 16;
    private readonly BOX_SIZE = 4;
    private grid: number[][];
    private iterationCount: number = 0;
    private startTime: number = 0;
    
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
    
    private solve(maxIterations: number = 1000000, timeoutMs: number = 5000): boolean {
        // Check timeout
        if (Date.now() - this.startTime > timeoutMs) {
            return false;
        }
        
        // Check iteration limit
        if (this.iterationCount >= maxIterations) {
            return false;
        }
        
        this.iterationCount++;
        
        // Find the most constrained cell (fewest possible values)
        let bestRow = -1, bestCol = -1, minOptions = 17;
        
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (this.grid[row][col] === 0) {
                    let options = 0;
                    for (let num = 1; num <= this.SIZE; num++) {
                        if (this.isValid(row, col, num)) {
                            options++;
                        }
                    }
                    
                    if (options < minOptions) {
                        minOptions = options;
                        bestRow = row;
                        bestCol = col;
                    }
                }
            }
        }
        
        // If no empty cells found, we're done
        if (bestRow === -1) {
            return true;
        }
        
        // If any cell has no options, this path is invalid
        if (minOptions === 0) {
            return false;
        }
        
        // Try numbers for the most constrained cell
        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        
        for (const num of numbers) {
            if (this.isValid(bestRow, bestCol, num)) {
                this.grid[bestRow][bestCol] = num;
                
                if (this.solve(maxIterations, timeoutMs)) {
                    return true;
                }
                
                this.grid[bestRow][bestCol] = 0;
            }
        }
        
        return false;
    }
    
    public generate(options: GenerationOptions = {}): SudokuGrid {
        const startTime = Date.now();
        const maxAttempts = options.maxAttempts || 1;
        const timeoutMs = options.timeoutMs || 5000;
        const maxIterations = options.maxIterations || 1000000;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            this.grid = this.createEmptyGrid();
            this.iterationCount = 0;
            this.startTime = startTime;
            
            if (this.solve(maxIterations, timeoutMs)) {
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

    private getDifficultySettings(difficulty: string): { minEmpty: number; maxEmpty: number } {
        switch (difficulty) {
            case 'easy': return { minEmpty: 60, maxEmpty: 80 };
            case 'medium': return { minEmpty: 80, maxEmpty: 100 };
            case 'hard': return { minEmpty: 100, maxEmpty: 120 };
            case 'expert': return { minEmpty: 120, maxEmpty: 140 };
            default: return { minEmpty: 80, maxEmpty: 100 };
        }
    }

    private getTechniqueDifficultySettings(difficulty: string): { 
        allowedTechniques: SolvingTechnique[]; 
        maxTechniqueLevel: number;
        minEmpty: number;
        maxEmpty: number;
    } {
        switch (difficulty) {
            case 'easy':
                return {
                    allowedTechniques: [
                        SolvingTechnique.NAKED_SINGLE,
                        SolvingTechnique.HIDDEN_SINGLE
                    ],
                    maxTechniqueLevel: 1,
                    minEmpty: 180,
                    maxEmpty: 200
                };
            case 'medium':
                return {
                    allowedTechniques: [
                        SolvingTechnique.NAKED_SINGLE,
                        SolvingTechnique.HIDDEN_SINGLE,
                        SolvingTechnique.NAKED_PAIR,
                        SolvingTechnique.HIDDEN_PAIR,
                        SolvingTechnique.INTERSECTION_REMOVAL
                    ],
                    maxTechniqueLevel: 2,
                    minEmpty: 160,
                    maxEmpty: 180
                };
            case 'hard':
                return {
                    allowedTechniques: [
                        SolvingTechnique.NAKED_SINGLE,
                        SolvingTechnique.HIDDEN_SINGLE,
                        SolvingTechnique.NAKED_PAIR,
                        SolvingTechnique.HIDDEN_PAIR,
                        SolvingTechnique.INTERSECTION_REMOVAL,
                        SolvingTechnique.NAKED_TRIPLE,
                        SolvingTechnique.HIDDEN_TRIPLE,
                        SolvingTechnique.X_WING,
                        SolvingTechnique.XY_WING
                    ],
                    maxTechniqueLevel: 3,
                    minEmpty: 140,
                    maxEmpty: 160
                };
            case 'expert':
                return {
                    allowedTechniques: [
                        SolvingTechnique.NAKED_SINGLE,
                        SolvingTechnique.HIDDEN_SINGLE,
                        SolvingTechnique.NAKED_PAIR,
                        SolvingTechnique.HIDDEN_PAIR,
                        SolvingTechnique.INTERSECTION_REMOVAL,
                        SolvingTechnique.NAKED_TRIPLE,
                        SolvingTechnique.HIDDEN_TRIPLE,
                        SolvingTechnique.X_WING,
                        SolvingTechnique.SWORDFISH,
                        SolvingTechnique.XY_WING,
                        SolvingTechnique.XYZ_WING,
                        SolvingTechnique.UNIQUE_RECTANGLE,
                        SolvingTechnique.FORCING_CHAIN,
                        SolvingTechnique.NISHIO,
                        SolvingTechnique.COLORING,
                        SolvingTechnique.MULTI_COLORING
                    ],
                    maxTechniqueLevel: 4,
                    minEmpty: 120,
                    maxEmpty: 140
                };
            default:
                return {
                    allowedTechniques: [
                        SolvingTechnique.NAKED_SINGLE,
                        SolvingTechnique.HIDDEN_SINGLE,
                        SolvingTechnique.NAKED_PAIR,
                        SolvingTechnique.HIDDEN_PAIR,
                        SolvingTechnique.INTERSECTION_REMOVAL
                    ],
                    maxTechniqueLevel: 2,
                    minEmpty: 100,
                    maxEmpty: 120
                };
        }
    }

    private countEmptyCells(grid: number[][]): number {
        return grid.reduce((count, row) => 
            count + row.reduce((rowCount, cell) => rowCount + (cell === 0 ? 1 : 0), 0), 0);
    }

    private getCandidates(grid: number[][], row: number, col: number): number[] {
        if (grid[row][col] !== 0) return [];
        
        const candidates: number[] = [];
        for (let num = 1; num <= this.SIZE; num++) {
            if (this.isValidForGrid(grid, row, col, num)) {
                candidates.push(num);
            }
        }
        return candidates;
    }

    private findNakedSingles(grid: number[][]): TechniqueAnalysis[] {
        const techniques: TechniqueAnalysis[] = [];
        
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (grid[row][col] === 0) {
                    const candidates = this.getCandidates(grid, row, col);
                    if (candidates.length === 1) {
                        techniques.push({
                            technique: SolvingTechnique.NAKED_SINGLE,
                            cells: [[row, col]],
                            candidates: candidates,
                            description: `Cell (${row},${col}) can only contain ${candidates[0]}`
                        });
                    }
                }
            }
        }
        
        return techniques;
    }

    private findHiddenSingles(grid: number[][]): TechniqueAnalysis[] {
        const techniques: TechniqueAnalysis[] = [];
        
        // Check rows
        for (let row = 0; row < this.SIZE; row++) {
            const candidates: { [key: number]: [number, number][] } = {};
            
            for (let col = 0; col < this.SIZE; col++) {
                if (grid[row][col] === 0) {
                    const cellCandidates = this.getCandidates(grid, row, col);
                    for (const candidate of cellCandidates) {
                        if (!candidates[candidate]) candidates[candidate] = [];
                        candidates[candidate].push([row, col]);
                    }
                }
            }
            
            for (const [candidate, positions] of Object.entries(candidates)) {
                if (positions.length === 1) {
                    techniques.push({
                        technique: SolvingTechnique.HIDDEN_SINGLE,
                        cells: positions,
                        candidates: [parseInt(candidate)],
                        description: `${candidate} can only go in (${positions[0][0]},${positions[0][1]}) in row ${row}`
                    });
                }
            }
        }
        
        // Check columns
        for (let col = 0; col < this.SIZE; col++) {
            const candidates: { [key: number]: [number, number][] } = {};
            
            for (let row = 0; row < this.SIZE; row++) {
                if (grid[row][col] === 0) {
                    const cellCandidates = this.getCandidates(grid, row, col);
                    for (const candidate of cellCandidates) {
                        if (!candidates[candidate]) candidates[candidate] = [];
                        candidates[candidate].push([row, col]);
                    }
                }
            }
            
            for (const [candidate, positions] of Object.entries(candidates)) {
                if (positions.length === 1) {
                    techniques.push({
                        technique: SolvingTechnique.HIDDEN_SINGLE,
                        cells: positions,
                        candidates: [parseInt(candidate)],
                        description: `${candidate} can only go in (${positions[0][0]},${positions[0][1]}) in column ${col}`
                    });
                }
            }
        }
        
        // Check boxes
        for (let boxRow = 0; boxRow < this.BOX_SIZE; boxRow++) {
            for (let boxCol = 0; boxCol < this.BOX_SIZE; boxCol++) {
                const candidates: { [key: number]: [number, number][] } = {};
                
                for (let i = 0; i < this.BOX_SIZE; i++) {
                    for (let j = 0; j < this.BOX_SIZE; j++) {
                        const row = boxRow * this.BOX_SIZE + i;
                        const col = boxCol * this.BOX_SIZE + j;
                        
                        if (grid[row][col] === 0) {
                            const cellCandidates = this.getCandidates(grid, row, col);
                            for (const candidate of cellCandidates) {
                                if (!candidates[candidate]) candidates[candidate] = [];
                                candidates[candidate].push([row, col]);
                            }
                        }
                    }
                }
                
                for (const [candidate, positions] of Object.entries(candidates)) {
                    if (positions.length === 1) {
                        techniques.push({
                            technique: SolvingTechnique.HIDDEN_SINGLE,
                            cells: positions,
                            candidates: [parseInt(candidate)],
                            description: `${candidate} can only go in (${positions[0][0]},${positions[0][1]}) in box (${boxRow},${boxCol})`
                        });
                    }
                }
            }
        }
        
        return techniques;
    }

    public analyzePuzzleDifficulty(grid: number[][]): DifficultyAnalysis {
        const solvingSteps: TechniqueAnalysis[] = [];
        const requiredTechniques: SolvingTechnique[] = [];
        const usedTechniques = new Set<SolvingTechnique>();
        
        // Make a copy to work with
        let workingGrid = grid.map(row => [...row]);
        
        // Keep solving until no more progress can be made
        let progress = true;
        while (progress) {
            progress = false;
            
            // Try naked singles first
            const nakedSingles = this.findNakedSingles(workingGrid);
            if (nakedSingles.length > 0) {
                solvingSteps.push(...nakedSingles);
                usedTechniques.add(SolvingTechnique.NAKED_SINGLE);
                
                // Apply the technique
                for (const step of nakedSingles) {
                    const [row, col] = step.cells[0];
                    workingGrid[row][col] = step.candidates[0];
                }
                progress = true;
                continue;
            }
            
            // Try hidden singles
            const hiddenSingles = this.findHiddenSingles(workingGrid);
            if (hiddenSingles.length > 0) {
                solvingSteps.push(...hiddenSingles);
                usedTechniques.add(SolvingTechnique.HIDDEN_SINGLE);
                
                // Apply the technique
                for (const step of hiddenSingles) {
                    const [row, col] = step.cells[0];
                    workingGrid[row][col] = step.candidates[0];
                }
                progress = true;
                continue;
            }
            
            // TODO: Implement more advanced techniques
            // For now, if we can't solve with singles, it's at least medium difficulty
            break;
        }
        
        // Determine difficulty based on techniques used
        let estimatedDifficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'easy';
        let maxTechniqueLevel = 0;
        
        if (usedTechniques.has(SolvingTechnique.NAKED_SINGLE) || usedTechniques.has(SolvingTechnique.HIDDEN_SINGLE)) {
            maxTechniqueLevel = Math.max(maxTechniqueLevel, 1);
            estimatedDifficulty = 'easy';
        }
        
        // If we couldn't solve completely, it's at least medium
        const emptyCells = this.countEmptyCells(workingGrid);
        if (emptyCells > 0) {
            estimatedDifficulty = 'medium';
            maxTechniqueLevel = 2;
        }
        
        return {
            requiredTechniques: Array.from(usedTechniques),
            maxTechniqueLevel,
            estimatedDifficulty,
            solvingSteps
        };
    }

    private removeCells(grid: number[][], targetEmpty: number): number[][] {
        const puzzle = grid.map(row => [...row]);
        const totalCells = this.SIZE * this.SIZE;
        const cellsToRemove = totalCells - targetEmpty;
        
        // Create list of all cell positions
        const positions: [number, number][] = [];
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                positions.push([i, j]);
            }
        }
        
        // Shuffle positions
        const shuffledPositions = this.shuffleArray(positions);
        
        // Remove cells one by one, checking solvability
        let removed = 0;
        for (const [row, col] of shuffledPositions) {
            if (removed >= cellsToRemove) break;
            
            const originalValue = puzzle[row][col];
            puzzle[row][col] = 0;
            
            // Check if puzzle is still solvable
            if (this.hasUniqueSolution(puzzle)) {
                removed++;
            } else {
                // Restore the cell if removing it makes puzzle unsolvable
                puzzle[row][col] = originalValue;
            }
        }
        
        return puzzle;
    }

    private hasUniqueSolution(grid: number[][]): boolean {
        const solutions: number[][][] = [];
        this.countSolutions(grid, solutions, 0);
        return solutions.length === 1;
    }

    private countSolutions(grid: number[][], solutions: number[][][], maxSolutions: number = 2): void {
        if (solutions.length >= maxSolutions) return;
        
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= this.SIZE; num++) {
                        if (this.isValidForGrid(grid, row, col, num)) {
                            grid[row][col] = num;
                            this.countSolutions(grid, solutions, maxSolutions);
                            grid[row][col] = 0;
                            
                            if (solutions.length >= maxSolutions) return;
                        }
                    }
                    return;
                }
            }
        }
        
        // If we get here, the grid is complete
        solutions.push(grid.map(row => [...row]));
    }

    private isValidForGrid(grid: number[][], row: number, col: number, num: number): boolean {
        // Check row
        for (let x = 0; x < this.SIZE; x++) {
            if (grid[row][x] === num) {
                return false;
            }
        }
        
        // Check column
        for (let x = 0; x < this.SIZE; x++) {
            if (grid[x][col] === num) {
                return false;
            }
        }
        
        // Check 4x4 box
        const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
        const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;
        
        for (let i = 0; i < this.BOX_SIZE; i++) {
            for (let j = 0; j < this.BOX_SIZE; j++) {
                if (grid[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }

    public generatePuzzle(options: PuzzleOptions = {}): SudokuPuzzle {
        const startTime = Date.now();
        const difficulty = options.difficulty || 'medium';
        const maxAttempts = options.maxAttempts || 5;
        const timeoutMs = options.timeoutMs || 5000;
        const maxIterations = options.maxIterations || 1000000;
        const useTechniqueDifficulty = options.useTechniqueDifficulty || false;
        
        let minEmpty: number, maxEmpty: number;
        let techniqueSettings: any = null;
        
        if (useTechniqueDifficulty) {
            techniqueSettings = this.getTechniqueDifficultySettings(difficulty);
            minEmpty = techniqueSettings.minEmpty;
            maxEmpty = techniqueSettings.maxEmpty;
        } else {
            const settings = this.getDifficultySettings(difficulty);
            minEmpty = settings.minEmpty;
            maxEmpty = settings.maxEmpty;
        }
        
        const targetEmpty = Math.floor(Math.random() * (maxEmpty - minEmpty + 1)) + minEmpty;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Generate a complete solution with timeout protection
            const solutionResult = this.generate({ 
                timeoutMs, 
                maxIterations,
                maxAttempts: 1 
            });
            if (!solutionResult.isValid) {
                continue;
            }
            
            // Create puzzle by removing cells
            const puzzle = this.removeCellsSimple(solutionResult.grid, targetEmpty);
            const actualEmpty = this.countEmptyCells(puzzle);
            
            // Analyze the puzzle difficulty if technique-based difficulty is requested
            let techniqueAnalysis: DifficultyAnalysis | undefined;
            if (useTechniqueDifficulty && techniqueSettings) {
                techniqueAnalysis = this.analyzePuzzleDifficulty(puzzle);
                
                // Check if the puzzle meets the difficulty requirements
                const meetsRequirements = techniqueAnalysis.requiredTechniques.every(technique => 
                    techniqueSettings.allowedTechniques.includes(technique)
                ) && techniqueAnalysis.maxTechniqueLevel <= techniqueSettings.maxTechniqueLevel;
                
                if (!meetsRequirements) {
                    continue; // Try again with a different puzzle
                }
            }
            
            const endTime = Date.now();
            return {
                puzzle,
                solution: solutionResult.grid,
                difficulty,
                isValid: true,
                generationTime: endTime - startTime,
                emptyCells: actualEmpty,
                techniqueAnalysis
            };
        }
        
        // Failed to generate
        const endTime = Date.now();
        return {
            puzzle: this.createEmptyGrid(),
            solution: this.createEmptyGrid(),
            difficulty,
            isValid: false,
            generationTime: endTime - startTime,
            emptyCells: 0
        };
    }

    private removeCellsSimple(grid: number[][], targetEmpty: number): number[][] {
        const puzzle = grid.map(row => [...row]);
        const totalCells = this.SIZE * this.SIZE;
        const cellsToRemove = totalCells - targetEmpty;
        
        // Create list of all cell positions
        const positions: [number, number][] = [];
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                positions.push([i, j]);
            }
        }
        
        // Shuffle positions
        const shuffledPositions = this.shuffleArray(positions);
        
        // Remove cells (simplified - no solvability check for performance)
        for (let i = 0; i < cellsToRemove; i++) {
            const [row, col] = shuffledPositions[i];
            puzzle[row][col] = 0;
        }
        
        return puzzle;
    }
}

// Convenience functions
export function generateSudoku16(options?: GenerationOptions): SudokuGrid {
    const generator = new Sudoku16Generator();
    return generator.generate(options);
}

export function generateSudokuPuzzle(options?: PuzzleOptions): SudokuPuzzle {
    const generator = new Sudoku16Generator();
    return generator.generatePuzzle(options);
}

export function printSudoku16(grid: number[][], compact = false): void {
    console.log(Sudoku16Generator.printGrid(grid, { compact }));
}

export function printSudokuPuzzle(puzzle: SudokuPuzzle, showSolution = false, compact = false): void {
    console.log(`\n=== ${puzzle.difficulty.toUpperCase()} PUZZLE ===`);
    console.log(`Empty cells: ${puzzle.emptyCells}`);
    console.log(`Generation time: ${puzzle.generationTime}ms\n`);
    
    if (showSolution) {
        console.log('SOLUTION:');
        console.log(Sudoku16Generator.printGrid(puzzle.solution, { compact }));
        console.log('\nPUZZLE:');
    }
    
    console.log(Sudoku16Generator.printGrid(puzzle.puzzle, { compact }));
}

export function validateSudoku16(grid: number[][]): boolean {
    const generator = new Sudoku16Generator();
    return generator.validateGrid(grid);
}

export function analyzePuzzleDifficulty(grid: number[][]): DifficultyAnalysis {
    const generator = new Sudoku16Generator();
    return generator.analyzePuzzleDifficulty(grid);
}