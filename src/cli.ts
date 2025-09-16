#!/usr/bin/env node

import { generateSudoku16, generateSudokuPuzzle, Sudoku16Generator, printSudokuPuzzle } from './index';

function showHelp() {
    console.log(`
Sudoku-0F - 16x16 Sudoku Generator

Usage:
  sudoku-0f [count] [options]
  sudoku-0f puzzle [difficulty] [count] [options]

Commands:
  (default)     Generate complete 16x16 Sudoku grids
  puzzle        Generate solvable puzzles with empty cells

Difficulties (for puzzles):
  easy          ~60-80 empty cells (traditional) or naked/hidden singles only (technique-based)
  medium        ~80-100 empty cells (traditional) or basic pairs + intersections (technique-based)
  hard          ~100-120 empty cells (traditional) or complex patterns + chains (technique-based)
  expert        ~120-140 empty cells (traditional) or advanced techniques + notation (technique-based)

Options:
  --compact     Use compact display format
  --solution    Show solution for puzzles
  --technique   Use technique-based difficulty instead of empty cell count
  --analysis    Show technique analysis for puzzles
  --help        Show this help message

Examples:
  sudoku-0f 3                           # Generate 3 complete grids
  sudoku-0f puzzle easy 2               # Generate 2 easy puzzles (traditional)
  sudoku-0f puzzle medium --technique   # Generate technique-based medium puzzle
  sudoku-0f puzzle hard --compact       # Generate 1 hard puzzle (compact)
  sudoku-0f puzzle --solution --analysis # Generate with solution and technique analysis
`);
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help')) {
        showHelp();
        return;
    }
    
    const isPuzzleMode = args[0] === 'puzzle';
    let difficulty = 'medium';
    let count = 1;
    let compact = args.includes('--compact');
    let showSolution = args.includes('--solution');
    let useTechnique = args.includes('--technique');
    let showAnalysis = args.includes('--analysis');
    
    if (isPuzzleMode) {
        // Parse puzzle arguments: puzzle [difficulty] [count] [options]
        const difficultyIndex = args.findIndex(arg => ['easy', 'medium', 'hard', 'expert'].includes(arg));
        if (difficultyIndex !== -1) {
            difficulty = args[difficultyIndex];
        }
        
        const countArg = args.find(arg => /^\d+$/.test(arg));
        if (countArg) {
            count = parseInt(countArg);
        }
        
        const difficultyType = useTechnique ? 'technique-based' : 'traditional';
        console.log(`Generating ${count} ${difficulty} (${difficultyType}) 16x16 Sudoku puzzle${count > 1 ? 's' : ''}...\n`);
        
        for (let i = 0; i < count; i++) {
            if (count > 1) {
                console.log(`=== Puzzle ${i + 1} ===`);
            }
            
            const result = generateSudokuPuzzle({ 
                difficulty: difficulty as any,
                timeoutMs: 10000,  // 10 second timeout
                maxIterations: 500000,  // 500k iterations max
                useTechniqueDifficulty: useTechnique
            });
            
            if (result.isValid) {
                printSudokuPuzzle(result, showSolution, compact);
                
                // Show technique analysis if requested
                if (showAnalysis && result.techniqueAnalysis) {
                    console.log('\n--- Technique Analysis ---');
                    console.log(`Required techniques: ${result.techniqueAnalysis.requiredTechniques.join(', ')}`);
                    console.log(`Max technique level: ${result.techniqueAnalysis.maxTechniqueLevel}`);
                    console.log(`Estimated difficulty: ${result.techniqueAnalysis.estimatedDifficulty}`);
                    console.log(`Solving steps: ${result.techniqueAnalysis.solvingSteps.length}`);
                    
                    if (result.techniqueAnalysis.solvingSteps.length > 0) {
                        console.log('\nFirst few solving steps:');
                        result.techniqueAnalysis.solvingSteps.slice(0, 5).forEach((step, idx) => {
                            console.log(`${idx + 1}. ${step.technique}: ${step.description}`);
                        });
                        if (result.techniqueAnalysis.solvingSteps.length > 5) {
                            console.log(`... and ${result.techniqueAnalysis.solvingSteps.length - 5} more steps`);
                        }
                    }
                }
                
                if (count > 1 && i < count - 1) {
                    console.log('\n' + '='.repeat(50) + '\n');
                }
            } else {
                console.error('Failed to generate valid puzzle\n');
            }
        }
    } else {
        // Original complete grid generation
        const countArg = args.find(arg => /^\d+$/.test(arg));
        if (countArg) {
            count = parseInt(countArg);
        }
        
        console.log(`Generating ${count} 16x16 Sudoku grid${count > 1 ? 's' : ''}...\n`);
        
        for (let i = 0; i < count; i++) {
            if (count > 1) {
                console.log(`=== Grid ${i + 1} ===`);
            }
            
            const result = generateSudoku16({ 
                timeoutMs: 10000,  // 10 second timeout
                maxIterations: 500000  // 500k iterations max
            });
            
            if (result.isValid) {
                console.log(Sudoku16Generator.printGrid(result.grid, { compact }));
                console.log(`Generated in ${result.generationTime}ms\n`);
            } else {
                console.error('Failed to generate valid grid\n');
            }
        }
    }
}

if (require.main === module) {
    main();
}