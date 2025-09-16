#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the compiled CommonJS version
const commonJSCode = fs.readFileSync(path.join(__dirname, '../dist/index.js'), 'utf8');

// Create a mock CommonJS environment and execute the code
const browserCode = `// Browser-compatible version of sudoku-0f
// This file is auto-generated - do not edit manually

(function() {
    // Mock CommonJS environment
    const exports = {};
    const module = { exports: {} };
    
    // Execute the original code in our mock environment
    ${commonJSCode}
    
    // Extract the classes and functions from the mock environment
    // Use different variable names to avoid conflicts
    const Sudoku16GeneratorClass = exports.Sudoku16Generator;
    const SolvingTechniqueEnum = exports.SolvingTechnique;
    const generateSudoku16Func = exports.generateSudoku16;
    const generateSudokuPuzzleFunc = exports.generateSudokuPuzzle;
    const printSudoku16Func = exports.printSudoku16;
    const printSudokuPuzzleFunc = exports.printSudokuPuzzle;
    const validateSudoku16Func = exports.validateSudoku16;
    const analyzePuzzleDifficultyFunc = exports.analyzePuzzleDifficulty;
    
    // Make everything available globally for the browser
    if (typeof window !== 'undefined') {
        window.Sudoku16Generator = Sudoku16GeneratorClass;
        window.SolvingTechnique = SolvingTechniqueEnum;
        window.generateSudoku16 = generateSudoku16Func;
        window.generateSudokuPuzzle = generateSudokuPuzzleFunc;
        window.printSudoku16 = printSudoku16Func;
        window.printSudokuPuzzle = printSudokuPuzzleFunc;
        window.validateSudoku16 = validateSudoku16Func;
        window.analyzePuzzleDifficulty = analyzePuzzleDifficultyFunc;
    }
})();
`;

// Write the browser version
fs.writeFileSync(path.join(__dirname, '../dist/index.browser.js'), browserCode);

console.log('✅ Browser build created: dist/index.browser.js');
