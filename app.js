
// Initialiuze canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define cell size and grid dimensions
const cellSize = 10;
const numRows = 500;
const numCols = 500;
// const numRows = Math.floor(canvas.height / cellSize);
// const numCols = Math.floor(canvas.width / cellSize);

// Funciton toinitialize the grid
function createGrid() {
    const grid = [];

    for (let i = 0; i < numRows; i++) {
        
        /* Example, outer loop

            grid = [
                [], // first row
                [], // second row
                [], // third row
                ... more grids
            ]

            Initializes an empty array at the i-th position of the grid array
        */
        grid[i] = [];

        for (let j = 0; j < numCols; j++) {

            /* Example, inner loop

                grid = [
                    [0, 1, 0], // first row
                    [1, 0, 0], // second row
                    [1, 0, 0], // third row
                    ... more grids
                ]

                Assign a value (eiter 1 or 0) to the specific cell in the i-th row and j-th column of the grid
            */

                let rand = Math.random() > 0.7 ? 1 : 0;
                if (rand) {
                    grid[i][j] = Math.random() > 0.7 ? 1 : 0;   // Random initialization
                } else {
                    grid[i][j] = Math.random() > 0.6 ? 1 : 0;   // Random initialization
                }
        }
    }
    return grid;
}

let grid = createGrid();
let isRunning = false;
let animationId = null;

// Function to draw the grid
function drawGrid()
{
    // Clear canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    // Loop through each cell
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {

            // If cell is alive, render it black
            if (grid[i][j] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Function to update te grid based on Conway's rules
function updateGrid() {

    // new grid
    const newGrid = [];

    for (let i = 0; i < numRows; i++) {

        // Initialize an empty array at the i-th position of the grid
        newGrid[i] = [];

        for (let j = 0; j < numCols; j++) {

            const neighbors = countNeighbors(i, j);

            // If cell is alive and neighbors is less than 2 or greater than 3, set cell 'dead'
            if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0;
            }

            // If cell is dead and neighbors is 3, set cell to 'alive'
            else if (grid[i][j] === 0 && neighbors === 3) {
                newGrid[i][j] = 1;
            }

            // If neither applies, leave cell as is
            else {
                newGrid[i][j] = grid[i][j];
            }
        }
    }

    // Apply newGrid to grid
    grid = newGrid;
}

// Function to count live neighbors of a cell
function countNeighbors(row, col) {
    let count = 0;

    // Loop through i: -1, 0, 1, checks rows above, self and below current cell
    for (let i = -1; i <= 1; i++)
    {
        // Loop through j: -1, 0, 1, checks left, self and right of current cell
        for (let j = -1; j <=1; j++)
        {
            // Calculate neighboring ro index by adding i to current row index
            const r = row + i;  // r represents the row of the neighboring cell

            // Calculate neighboring column index by adding j to current column index
            const c = col + j;  // c represents the column of neighboring cell

            // Ensure calculated row and column are within grid bounds
            // Make sure not to count current cell itself (i === 0 && j === 0 is the current cell)

            // If row or neighboring cells is within bounds
            if (r >= 0 && r < numRows && 
                
                // if column of neighboring cell is within bounds
                c >= 0 && c < numCols && 
                
                // If not current cell itself
                !(i === 0 && j === 0)) {

                // Increase current cell's neighbor count
                count += grid[r][c];
            }
        }
    }

    return count;
}

// Main loop, update and draw grid
function mainLoop() {
    updateGrid();
    drawGrid();

    // If game is running, set 'animationId'
    if (isRunning) {
        animationId = requestAnimationFrame(mainLoop);
    }
}

// Event listener to handle mouse clicks for adding/removing cells
canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Left-click: Toggle cell (add/remove life)
    if (e.button === 0) {
        grid[row][col] = 1; // Add a live cell (1)
    }

    drawGrid(); // Redraw grid after clicking
});

// Event listener to handle right-click menu from appearing
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // Prevent right-click menu from appearing

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    // Right-click: Remove te cell (set it to 0)
    grid[row][col] = 0;

    drawGrid(); // Redraw grid after right-click
})

// Add event listener to 'startButton'
document.getElementById('startButton').addEventListener('click', function()
{
    // Run game
    if (!isRunning) {
        isRunning = true;
        mainLoop();
    }
});

// Add event listener to 'pauseButton'
document.getElementById('pauseButton').addEventListener('click', function()
{
    // Pause game
    isRunning = false;

    // Stop animation
    cancelAnimationFrame(animationId);
});

// Add event listener to 'restartButton'
document.getElementById('restartButton').addEventListener('click', function()
{
    // Stop game
    isRunning = false;

    // Stop animation
    cancelAnimationFrame(animationId);

    // Create new grid
    grid = createGrid();

    // Draw grid
    drawGrid();
});

// Initial drawing of the grid
drawGrid();
