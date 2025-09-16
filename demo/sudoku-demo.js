// 16x16 Sudoku Generator Demo
// This demo uses the actual compiled JavaScript from the TypeScript library

// Import the actual Sudoku library (we'll load it via script tag)
// The Sudoku16Generator class and functions will be available globally

// Demo Application
class SudokuDemo {
    constructor() {
        // Use the actual library functions
        this.generator = new Sudoku16Generator();
        this.currentGrid = null;
        this.currentSolution = null;
        this.givenCells = new Set();
        this.selectedCell = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.createGrid();
    }
    
    initializeElements() {
        this.modeSelect = document.getElementById('mode');
        this.difficultyGroup = document.getElementById('difficulty-group');
        this.techniqueGroup = document.getElementById('technique-group');
        this.difficultySelect = document.getElementById('difficulty');
        this.useTechniqueCheckbox = document.getElementById('use-technique-difficulty');
        this.generateBtn = document.getElementById('generate-btn');
        this.validateBtn = document.getElementById('validate-btn');
        this.solveBtn = document.getElementById('solve-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.gridContainer = document.getElementById('sudoku-grid');
        this.generationInfo = document.getElementById('generation-info');
        this.validationResult = document.getElementById('validation-result');
        this.techniqueAnalysis = document.getElementById('technique-analysis');
        this.hexOutput = document.getElementById('hex-output');
        this.loadHexBtn = document.getElementById('load-hex-btn');
    }
    
    attachEventListeners() {
        this.modeSelect.addEventListener('change', () => this.toggleMode());
        this.useTechniqueCheckbox.addEventListener('change', () => this.updateDifficultyLabels());
        this.generateBtn.addEventListener('click', () => this.generate());
        this.validateBtn.addEventListener('click', () => this.validate());
        this.solveBtn.addEventListener('click', () => this.showSolution());
        this.clearBtn.addEventListener('click', () => this.clearGrid());
        this.loadHexBtn.addEventListener('click', () => this.loadFromHex());
    }
    
    toggleMode() {
        const isPuzzleMode = this.modeSelect.value === 'puzzle';
        this.difficultyGroup.style.display = isPuzzleMode ? 'flex' : 'none';
        this.techniqueGroup.style.display = isPuzzleMode ? 'flex' : 'none';
        this.validateBtn.disabled = !isPuzzleMode;
        this.solveBtn.disabled = !isPuzzleMode;
        this.updateDifficultyLabels();
    }

    updateDifficultyLabels() {
        const useTechnique = this.useTechniqueCheckbox.checked;
        const options = this.difficultySelect.options;
        
        if (useTechnique) {
            options[0].text = 'Easy (singles only)';
            options[1].text = 'Medium (pairs + intersections)';
            options[2].text = 'Hard (complex patterns)';
            options[3].text = 'Expert (advanced techniques)';
        } else {
            options[0].text = 'Easy (60-80 empty)';
            options[1].text = 'Medium (80-100 empty)';
            options[2].text = 'Hard (100-120 empty)';
            options[3].text = 'Expert (120-140 empty)';
        }
    }
    
    createGrid() {
        this.gridContainer.innerHTML = '';
        this.gridContainer.className = 'compact';
        
        for (let i = 0; i < 256; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.selectCell(i));
            cell.addEventListener('keydown', (e) => this.handleKeyInput(e, i));
            cell.tabIndex = 0;
            this.gridContainer.appendChild(cell);
        }
    }
    
    selectCell(index) {
        // Remove previous selection
        if (this.selectedCell !== null) {
            const prevCell = this.gridContainer.children[this.selectedCell];
            prevCell.classList.remove('selected');
        }
        
        // Select new cell
        this.selectedCell = index;
        const cell = this.gridContainer.children[index];
        cell.classList.add('selected');
        cell.focus();
    }
    
    handleKeyInput(event, index) {
        const cell = this.gridContainer.children[index];
        const key = event.key.toLowerCase();
        
        // Handle number input (0-F)
        if (key >= '0' && key <= '9') {
            const hexValue = parseInt(key);
            // Convert hex input (0-9) to internal value (1-10)
            const internalValue = hexValue + 1;
            this.setCellValue(index, internalValue);
        } else if (key >= 'a' && key <= 'f') {
            const hexValue = key.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
            // Convert hex input (A-F = 10-15) to internal value (11-16)
            const internalValue = hexValue + 1;
            this.setCellValue(index, internalValue);
        } else if (key === 'backspace' || key === 'delete') {
            this.setCellValue(index, 0);
        } else if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright') {
            event.preventDefault();
            this.navigateGrid(key, index);
        }
    }
    
    setCellValue(index, value) {
        if (this.givenCells.has(index)) return; // Don't allow editing given cells
        
        const cell = this.gridContainer.children[index];
        const row = Math.floor(index / 16);
        const col = index % 16;
        
        if (value === 0) {
            cell.textContent = '';
            cell.classList.remove('user-input', 'error');
        } else {
            cell.textContent = (value - 1).toString(16).toUpperCase();
            cell.classList.add('user-input');
            cell.classList.remove('error');
        }
        
        // Update internal grid
        if (!this.currentGrid) {
            // Use the actual library function
            this.currentGrid = this.generator.createEmptyGrid();
        }
        this.currentGrid[row][col] = value;
        
        // Update hex output
        this.updateHexOutput();
    }
    
    navigateGrid(direction, currentIndex) {
        let newIndex = currentIndex;
        
        switch (direction) {
            case 'arrowup':
                newIndex = Math.max(0, currentIndex - 16);
                break;
            case 'arrowdown':
                newIndex = Math.min(255, currentIndex + 16);
                break;
            case 'arrowleft':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'arrowright':
                newIndex = Math.min(255, currentIndex + 1);
                break;
        }
        
        this.selectCell(newIndex);
    }
    
    generate() {
        this.generationInfo.textContent = 'Generating...';
        this.validationResult.textContent = '';
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            const isPuzzleMode = this.modeSelect.value === 'puzzle';
            let result;
            
            if (isPuzzleMode) {
                const difficulty = this.difficultySelect.value;
                const useTechnique = this.useTechniqueCheckbox.checked;
                
                // Use the actual library function
                result = generateSudokuPuzzle({ 
                    difficulty,
                    useTechniqueDifficulty: useTechnique,
                    timeoutMs: 5000,
                    maxIterations: 100000
                });
                
                if (result.isValid) {
                    this.currentGrid = result.puzzle;
                    this.currentSolution = result.solution;
                    this.displayGrid(result.puzzle, true);
                    
                    const difficultyType = useTechnique ? 'technique-based' : 'traditional';
                    this.generationInfo.innerHTML = `
                        Generated ${difficulty} (${difficultyType}) puzzle in ${result.generationTime}ms<br>
                        Empty cells: ${result.emptyCells}
                    `;
                    
                    // Show technique analysis if available
                    if (result.techniqueAnalysis) {
                        this.displayTechniqueAnalysis(result.techniqueAnalysis);
                    } else {
                        this.hideTechniqueAnalysis();
                    }
                } else {
                    this.generationInfo.textContent = 'Failed to generate puzzle';
                    this.hideTechniqueAnalysis();
                }
            } else {
                // Use the actual library function
                result = generateSudoku16();
                
                if (result.isValid) {
                    this.currentGrid = result.grid;
                    this.currentSolution = null;
                    this.displayGrid(result.grid, false);
                    this.generationInfo.textContent = `Generated complete grid in ${result.generationTime}ms`;
                } else {
                    this.generationInfo.textContent = 'Failed to generate grid';
                }
            }
            
            this.updateHexOutput();
        }, 10);
    }
    
    displayGrid(grid, isPuzzle) {
        this.givenCells.clear();
        
        for (let i = 0; i < 256; i++) {
            const cell = this.gridContainer.children[i];
            const row = Math.floor(i / 16);
            const col = i % 16;
            const value = grid[row][col];
            
            cell.classList.remove('given', 'user-input', 'error');
            
            if (value === 0) {
                cell.textContent = '';
            } else {
                cell.textContent = (value - 1).toString(16).toUpperCase();
                if (isPuzzle) {
                    cell.classList.add('given');
                    this.givenCells.add(i);
                }
            }
        }
    }
    
    validate() {
        if (!this.currentGrid) {
            this.validationResult.textContent = 'No grid to validate';
            return;
        }
        
        // Use the actual library function
        const isValid = validateSudoku16(this.currentGrid);
        this.validationResult.textContent = isValid ? 
            '✓ Grid is valid!' : 
            '✗ Grid has errors';
        
        // Highlight errors
        this.highlightErrors();
    }
    
    highlightErrors() {
        // Clear previous error highlighting
        for (let i = 0; i < 256; i++) {
            this.gridContainer.children[i].classList.remove('error');
        }
        
        // Check for conflicts using the actual library
        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 16; col++) {
                const value = this.currentGrid[row][col];
                if (value !== 0) {
                    // Create a temporary grid to test validity
                    const tempGrid = this.currentGrid.map(r => [...r]);
                    tempGrid[row][col] = 0;
                    
                    // Use the generator's isValid method
                    if (!this.generator.isValidForGrid(tempGrid, row, col, value)) {
                        const index = row * 16 + col;
                        this.gridContainer.children[index].classList.add('error');
                    }
                }
            }
        }
    }
    
    showSolution() {
        if (!this.currentSolution) {
            this.validationResult.textContent = 'No solution available';
            return;
        }
        
        this.displayGrid(this.currentSolution, false);
        this.currentGrid = this.currentSolution;
        this.updateHexOutput();
        this.validationResult.textContent = 'Solution displayed';
    }
    
    clearGrid() {
        // Use the actual library function
        this.currentGrid = this.generator.createEmptyGrid();
        this.currentSolution = null;
        this.givenCells.clear();
        this.displayGrid(this.currentGrid, false);
        this.updateHexOutput();
        this.generationInfo.textContent = '';
        this.validationResult.textContent = '';
        this.hideTechniqueAnalysis();
    }

    displayTechniqueAnalysis(analysis) {
        this.techniqueAnalysis.style.display = 'block';
        this.techniqueAnalysis.innerHTML = `
            <h4>🔍 Technique Analysis</h4>
            <div class="analysis-content">
                <p><strong>Required Techniques:</strong> ${analysis.requiredTechniques.join(', ') || 'None'}</p>
                <p><strong>Difficulty Level:</strong> ${analysis.maxTechniqueLevel}</p>
                <p><strong>Estimated Difficulty:</strong> ${analysis.estimatedDifficulty}</p>
                <p><strong>Solving Steps:</strong> ${analysis.solvingSteps.length}</p>
                ${analysis.solvingSteps.length > 0 ? `
                    <details>
                        <summary>View first few steps</summary>
                        <ol>
                            ${analysis.solvingSteps.slice(0, 10).map(step => 
                                `<li><strong>${step.technique}:</strong> ${step.description}</li>`
                            ).join('')}
                            ${analysis.solvingSteps.length > 10 ? `<li>... and ${analysis.solvingSteps.length - 10} more steps</li>` : ''}
                        </ol>
                    </details>
                ` : ''}
            </div>
        `;
    }

    hideTechniqueAnalysis() {
        this.techniqueAnalysis.style.display = 'none';
        this.techniqueAnalysis.innerHTML = '';
    }
    
    
    updateHexOutput() {
        if (!this.currentGrid) {
            this.hexOutput.value = '';
            return;
        }
        
        // Use the actual library function
        this.hexOutput.value = Sudoku16Generator.gridToHex(this.currentGrid);
    }
    
    loadFromHex() {
        try {
            const hexString = this.hexOutput.value.trim();
            if (!hexString) {
                this.validationResult.textContent = 'No hex data to load';
                return;
            }
            
            // Use the actual library function
            const grid = Sudoku16Generator.hexToGrid(hexString);
            this.currentGrid = grid;
            this.currentSolution = null;
            this.displayGrid(grid, false);
            this.validationResult.textContent = 'Grid loaded from hex';
        } catch (error) {
            this.validationResult.textContent = `Error: ${error.message}`;
        }
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuDemo();
});
