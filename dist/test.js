"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/test.ts
const index_1 = require("./index");
function runTests() {
    console.log('Testing 16x16 Sudoku Generator...\n');
    // Test basic generation
    console.log('1. Basic generation test:');
    const result = (0, index_1.generateSudoku16)();
    console.log(`   Generated: ${result.isValid ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Time: ${result.generationTime}ms`);
    console.log(`   Validation: ${(0, index_1.validateSudoku16)(result.grid) ? 'PASS' : 'FAIL'}\n`);
    // Test multiple generations
    console.log('2. Performance test (5 generations):');
    const times = [];
    let successes = 0;
    for (let i = 0; i < 5; i++) {
        const testResult = (0, index_1.generateSudoku16)();
        if (testResult.isValid) {
            successes++;
            times.push(testResult.generationTime);
        }
    }
    console.log(`   Success rate: ${successes}/5`);
    if (times.length > 0) {
        console.log(`   Average time: ${(times.reduce((a, b) => a + b) / times.length).toFixed(2)}ms`);
        console.log(`   Min time: ${Math.min(...times)}ms`);
        console.log(`   Max time: ${Math.max(...times)}ms`);
    }
    console.log();
    // Test hex conversion
    console.log('3. Hex conversion test:');
    const hexString = index_1.Sudoku16Generator.gridToHex(result.grid);
    const convertedBack = index_1.Sudoku16Generator.hexToGrid(hexString);
    const conversionValid = JSON.stringify(result.grid) === JSON.stringify(convertedBack);
    console.log(`   Hex conversion: ${conversionValid ? 'PASS' : 'FAIL'}\n`);
    // Show sample output
    console.log('4. Sample grid:');
    console.log(index_1.Sudoku16Generator.printGrid(result.grid, { compact: false }));
    console.log('All tests completed!');
}
if (require.main === module) {
    runTests();
}
//# sourceMappingURL=test.js.map