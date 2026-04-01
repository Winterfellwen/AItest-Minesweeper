export class GameEngine {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.totalMines = mines;
    this.revealedCount = 0;
    this.flagCount = 0;
    this.firstClick = true;
    this.board = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isMine: false,
        adjacentMines: 0,
        isRevealed: false,
        isFlagged: false,
      }))
    );
  }

  getBoard() {
    return this.board;
  }

  getFlagCount() {
    return this.flagCount;
  }

  placeMines(safeRow, safeCol) {
    const safeCells = new Set();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = safeRow + dr;
        const nc = safeCol + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          safeCells.add(`${nr},${nc}`);
        }
      }
    }

    let placed = 0;
    while (placed < this.totalMines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.board[r][c].isMine && !safeCells.has(`${r},${c}`)) {
        this.board[r][c].isMine = true;
        placed++;
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.board[r][c].isMine) {
          this.board[r][c].adjacentMines = this.countAdjacent(r, c);
        }
      }
    }
  }

  countAdjacent(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (
          nr >= 0 &&
          nr < this.rows &&
          nc >= 0 &&
          nc < this.cols &&
          this.board[nr][nc].isMine
        ) {
          count++;
        }
      }
    }
    return count;
  }

  floodFill(row, col) {
    const visited = new Set();
    const stack = [[row, col]];

    while (stack.length > 0) {
      const [r, c] = stack.pop();
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) continue;

      const cell = this.board[r][c];
      if (cell.isRevealed || cell.isMine || cell.isFlagged) continue;

      cell.isRevealed = true;
      this.revealedCount++;
      visited.add(key);

      if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            stack.push([r + dr, c + dc]);
          }
        }
      }
    }

    return visited;
  }

  revealCell(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return { gameOver: false, isWin: false, hitMine: false };
    }

    const cell = this.board[row][col];
    if (cell.isRevealed || cell.isFlagged) {
      return { gameOver: false, isWin: false, hitMine: false };
    }

    if (this.firstClick) {
      this.placeMines(row, col);
      this.firstClick = false;
    }

    if (cell.isMine) {
      cell.isRevealed = true;
      return { gameOver: true, isWin: false, hitMine: true };
    }

    this.floodFill(row, col);

    const isWin = this.revealedCount === this.rows * this.cols - this.totalMines;
    return {
      gameOver: isWin,
      isWin,
      hitMine: false,
    };
  }

  toggleFlag(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols)
      return false;
    const cell = this.board[row][col];
    if (cell.isRevealed) return false;
    cell.isFlagged = !cell.isFlagged;
    this.flagCount += cell.isFlagged ? 1 : -1;
    return true;
  }

  revealAll() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.board[r][c].isRevealed = true;
      }
    }
  }
}
