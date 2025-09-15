#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function main() {
    const args = process.argv.slice(2);
    const count = parseInt(args[0]) || 1;
    const compact = args.includes('--compact');
    console.log(`Generating ${count} 16x16 Sudoku grid${count > 1 ? 's' : ''}...\n`);
    for (let i = 0; i < count; i++) {
        if (count > 1) {
            console.log(`=== Grid ${i + 1} ===`);
        }
        const result = (0, index_1.generateSudoku16)();
        if (result.isValid) {
            console.log(index_1.Sudoku16Generator.printGrid(result.grid, { compact }));
            console.log(`Generated in ${result.generationTime}ms\n`);
        }
        else {
            console.error('Failed to generate valid grid\n');
        }
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=cli.js.map