// src/test.ts
import { generateSudoku16, validateSudoku16, Sudoku16Generator } from './index';

function runTests() {
    console.log('Testing 16x16 Sudoku Generator...\n');
    
    // Test basic generation
    console.log('1. Basic generation test:');
    const result = generateSudoku16();
    console.log(`   Generated: ${result.isValid ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Time: ${result.generationTime}ms`);
    console.log(`   Validation: ${validateSudoku16(result.grid) ? 'PASS' : 'FAIL'}\n`);
    
    // Test multiple generations
    console.log('2. Performance test (5 generations):');
    const times: number[] = [];
    let successes = 0;
    
    for (let i = 0; i < 5; i++) {
        const testResult = generateSudoku16();
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
    const hexString = Sudoku16Generator.gridToHex(result.grid);
    const convertedBack = Sudoku16Generator.hexToGrid(hexString);
    const conversionValid = JSON.stringify(result.grid) === JSON.stringify(convertedBack);
    console.log(`   Hex conversion: ${conversionValid ? 'PASS' : 'FAIL'}\n`);
    
    // Show sample output
    console.log('4. Sample grid:');
    console.log(Sudoku16Generator.printGrid(result.grid, { compact: false }));
    
    console.log('All tests completed!');
}

if (require.main === module) {
    runTests();
}