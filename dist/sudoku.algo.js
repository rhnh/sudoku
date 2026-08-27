/**
 * This a temporary solution.  needed to rewritten.
 * @param grid
 * @param rowStart
 * @param colStart
 * @param num
 * @returns
 */
import { BOARD_SIZE } from "./constants";
import { getKeys, positionToKey } from "./utils";
// https://www.geeksforgeeks.org/dsa/program-sudoku-generator/
// JavaScript program to generate a valid sudoku
// with k empty cells
// Returns false if given 3x3 block contains num
// Ensure the number is not used in the box
function unUsedInBox(grid, rowStart, colStart, num) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[rowStart + i][colStart + j] === num) {
                return false;
            }
        }
    }
    return true;
}
// Fill a 3x3 matrix
// Assign valid random numbers to the 3x3 sub-grid
function fillBox(grid, row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                // Generate a random number between 1 and 9
                num = Math.floor(Math.random() * 9) + 1;
            } while (!unUsedInBox(grid, row, col, num));
            grid[row + i][col + j] = num;
        }
    }
}
// Check if it's safe to put num in row i
// Ensure num is not already used in the row
function unUsedInRow(grid, i, num) {
    for (let j = 0; j < 9; j++) {
        if (grid[i][j] === num) {
            return false;
        }
    }
    return true;
}
// Check if it's safe to put num in column j
// Ensure num is not already used in the column
function unUsedInCol(grid, j, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[i][j] === num) {
            return false;
        }
    }
    return true;
}
// Check if it's safe to put num in the cell (i, j)
// Ensure num is not used in row, column, or box
function checkIfSafe(grid, i, j, num) {
    return (unUsedInRow(grid, i, num) &&
        unUsedInCol(grid, j, num) &&
        unUsedInBox(grid, i - (i % 3), j - (j % 3), num));
}
// Fill the diagonal 3x3 matrices
// The diagonal blocks are filled to simplify the process
function fillDiagonal(grid) {
    const RATIO = 3;
    for (let i = 0; i < BOARD_SIZE; i += RATIO) {
        // Fill each 3x3 sub-grid diagonally
        fillBox(grid, i, i);
    }
}
// Fill remaining blocks in the grid
// Recursively fill the remaining cells with valid numbers
function fillRemaining(grid, i, j) {
    // If we've reached the end of the grid
    if (i === BOARD_SIZE) {
        return true;
    }
    // Move to next row when current row is finished
    if (j === 9) {
        return fillRemaining(grid, i + 1, 0);
    }
    // Skip if cell is already filled
    if (grid[i][j] !== 0) {
        return fillRemaining(grid, i, j + 1);
    }
    // Try numbers 1-9 in current cell
    for (let num = 1; num <= BOARD_SIZE; num++) {
        if (checkIfSafe(grid, i, j, num)) {
            grid[i][j] = num;
            if (fillRemaining(grid, i, j + 1)) {
                return true;
            }
            grid[i][j] = 0;
        }
    }
    return false;
}
// Remove K digits randomly from the grid
// This will create a Sudoku puzzle by removing digits
function removeKDigits(grid, k) {
    const removed = new Map();
    while (k > 0) {
        const cellId = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
        const i = Math.floor(cellId / BOARD_SIZE);
        const j = cellId % BOARD_SIZE;
        if (grid[i][j] !== 0) {
            removed.set(positionToKey([i, j]), grid[i][j]);
            // Empty the cell
            grid[i][j] = 0;
            // Decrease the count of digits to remove
            k--;
        }
    }
    return removed;
}
// Generate a Sudoku grid with K empty cells
export function sudokuGenerator(k) {
    // Initialize an empty 9x9 grid
    const grid = Array.from({ length: BOARD_SIZE })
        .fill(0)
        .map(() => Array.from({ length: BOARD_SIZE }).fill(0));
    // Fill the diagonal 3x3 matrices
    fillDiagonal(grid);
    // Fill the remaining blocks in the grid
    fillRemaining(grid, 0, 0);
    // Remove K digits randomly to create the puzzle
    return { grid, solution: removeKDigits(grid, k) };
}
export const getCells = (emptyCells) => {
    const cells = new Map();
    const sudokuGenerated = sudokuGenerator(emptyCells);
    const sudoku = sudokuGenerated.grid.flat();
    const solutions = sudokuGenerated.solution;
    getKeys().forEach((key, i) => {
        // Calculate square number (1–9)
        const row = Math.floor(i / BOARD_SIZE);
        const col = i % BOARD_SIZE;
        const RATIO = 3;
        const block = Math.floor(row / RATIO) * RATIO + Math.floor(col / RATIO) + 1;
        const k = key.replace(/.$/, `${block}`);
        cells.set(k, `${sudoku[i]}`);
    });
    return { cells, solutions };
};
//# sourceMappingURL=sudoku.algo.js.map