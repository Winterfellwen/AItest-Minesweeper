// Minesweeper game logic
let board = []; // 2D array of cell values (-1 for mine, 0-8 for numbers)
let revealed = []; // 2D boolean array
let flagged = []; // 2D boolean array (optional, for flagging mines)
let width = 10, height = 10, mines = 10;
let gameOver = false;
let firstClick = true; // To ensure first click is never a mine

const gameContainer = document.getElementById('game-container');
const statusDisplay = document.getElementById('status');

// Initialize the game
function initGame(w, h, m) {
    width = w;
    height = h;
    mines = m;
    gameOver = false;
    firstClick = true;
    statusDisplay.textContent = '';

    // Initialize arrays
    board = Array.from({ length: height }, () => Array(width).fill(0));
    revealed = Array.from({ length: height }, () => Array(width).fill(false));
    flagged = Array.from({ length: height }, () => Array(width).fill(false));

    // Clear container
    gameContainer.innerHTML = '';
    gameContainer.style.gridTemplateColumns = `repeat(${width}, 30px)`;
    gameContainer.style.gridTemplateRows = `repeat(${height}, 30px)`;

    // Create cells
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', handleLeftClick);
            cell.addEventListener('contextmenu', handleRightClick); // Right click for flag
            gameContainer.appendChild(cell);
        }
    }
}

// Handle left click to reveal a cell
function handleLeftClick(e) {
    if (gameOver) return;

    const x = parseInt(this.dataset.x);
    const y = parseInt(this.dataset.y);

    // If first click, generate board ensuring this cell is not a mine
    if (firstClick) {
        generateBoard(x, y);
        firstClick = false;
    }

    // If flagged, do nothing on left click
    if (flagged[y][x]) return;

    revealCell(x, y);
}

// Handle right click to flag/unflag a cell
function handleRightClick(e) {
    e.preventDefault(); // Prevent context menu
    if (gameOver) return;

    const x = parseInt(this.dataset.x);
    const y = parseInt(this.dataset.y);

    if (revealed[y][x]) return;

    flagged[y][x] = !flagged[y][x];
    this.classList.toggle('flagged', flagged[y][x]);
    if (flagged[y][x]) {
        this.textContent = '🚩';
    } else {
        this.textContent = '';
    }
}

// Reveal a cell and recursively reveal adjacent zeros
function revealCell(x, y) {
    // Out of bounds or already revealed
    if (x < 0 || x >= width || y < 0 || y >= height || revealed[y][x]) return;

    revealed[y][x] = true;
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    cell.classList.add('revealed');

    if (board[y][x] === -1) {
        // Game over: reveal all mines
        gameOver = true;
        statusDisplay.textContent = 'Game Over!';
        revealAllMines();
        return;
    }

    // Display number or leave empty for 0
    if (board[y][x] > 0) {
        cell.textContent = board[y][x];
        cell.classList.add(`adjacent-${board[y][x]}`);
    } else {
        // Recursively reveal adjacent cells
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                revealCell(x + dx, y + dy);
            }
        }
    }

    // Check for win
    if (checkWin()) {
        gameOver = true;
        statusDisplay.textContent = 'You Win!';
    }
}

// Reveal all mines (for game over)
function revealAllMines() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (board[y][x] === -1) {
                const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
                cell.classList.add('revealed', 'mine');
                cell.textContent = '💣';
            }
        }
    }
}

// Check if all non-mine cells are revealed
function checkWin() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (board[y][x] !== -1 && !revealed[y][x]) {
                return false;
            }
        }
    }
    return true;
}

// Generate a new board with mines, ensuring (firstX, firstY) is not a mine
function generateBoard(firstX, firstY) {
    // Reset board
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            board[y][x] = 0;
        }
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        // Skip the first clicked cell and its neighbors to make it easier
        if (x === firstX && y === firstY) continue;
        if (Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1) continue;
        if (board[y][x] !== -1) {
            board[y][x] = -1;
            minesPlaced++;
        }
    }

    // Compute numbers
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (board[y][x] === -1) continue;
            let count = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        if (board[ny][nx] === -1) count++;
                    }
                }
            }
            board[y][x] = count;
        }
    }
}

// Difficulty settings
function setBeginner() {
    initGame(10, 10, 10);
}
function setIntermediate() {
    initGame(16, 16, 40);
}
function setExpert() {
    initGame(30, 16, 99);
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    // Create difficulty buttons
    const controls = document.getElementById('controls');
    controls.innerHTML = '';
    const btnBeginner = document.createElement('button');
    btnBeginner.textContent = 'Beginner';
    btnBeginner.onclick = setBeginner;
    const btnIntermediate = document.createElement('button');
    btnIntermediate.textContent = 'Intermediate';
    btnIntermediate.onclick = setIntermediate;
    const btnExpert = document.createElement('button');
    btnExpert.textContent = 'Expert';
    btnExpert.onclick = setExpert;
    const btnReset = document.createElement('button');
    btnReset.textContent = 'Reset';
    btnReset.onclick = () => initGame(width, height, mines); // Reset with current settings

    controls.appendChild(btnBeginner);
    controls.appendChild(btnIntermediate);
    controls.appendChild(btnExpert);
    controls.appendChild(btnReset);

    // Start with beginner
    setBeginner();
});

// Optional: Fetch board from Django backend instead of generating locally
// Uncomment the following to use the backend API for new board
/*
function fetchNewBoard() {
    fetch(`/game/new_board/?width=${width}&height=${height}&mines=${mines}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                statusDisplay.textContent = 'Error: ' + data.error;
                return;
            }
            board = data.board;
            // Note: We assume the backend returns a board with mines placed and numbers computed.
            // We'll then reveal based on user clicks.
            // We need to adjust the revealCell function to use the board from backend.
            // For simplicity, we'll just use the board as is and not regenerate on first click.
            // But note: the backend board is fixed, so first click might be a mine.
            // We'll leave the firstClick logic out if using backend.
            firstClick = false; // Disable first click safety when using backend
            // We'll need to reveal cells based on the backend board.
            // We'll change revealCell to use the board from the backend.
            // However, for now, we'll stick with local generation for simplicity.
        })
        .catch(err => {
            statusDisplay.textContent = 'Network error';
            console.error(err);
        });
}
*/

// Note: To use the backend, replace the generateBoard call in handleLeftClick with a fetch
// and then set the board from the response. Also adjust revealCell to use the fetched board.
// We'll leave that as an exercise or for a more advanced version.