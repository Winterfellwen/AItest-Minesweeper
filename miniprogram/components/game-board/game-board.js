import { COLORS, NUMBER_COLORS } from "../../utils/constants";

Component({
  properties: {
    board: { type: Array, value: [] },
    rows: { type: Number, value: 9 },
    cols: { type: Number, value: 9 },
    gameOver: { type: Boolean, value: false },
  },

  data: {
    cellSize: 30,
    canvasWidth: 0,
    canvasHeight: 0,
    offsetX: 0,
    offsetY: 0,
  },

  lifetimes: {
    ready() {
      this._calcSize();
    },
  },

  observers: {
    canvasWidth() {
      this._initCanvas();
    },
    board() {
      var self = this;
      setTimeout(function () {
        if (self._ctx) self._drawBoard();
      }, 80);
    },
  },

  methods: {
    _calcSize() {
      var rows = this.properties.rows;
      var cols = this.properties.cols;
      var screenWidth = wx.getWindowInfo().windowWidth;
      var padding = 24;
      var maxBoardWidth = screenWidth - padding;
      var cellSize = Math.floor(maxBoardWidth / cols);
      if (cellSize > 44) cellSize = 44;
      if (cellSize < 18) cellSize = 18;
      var boardWidth = cols * cellSize;
      var boardHeight = rows * cellSize;
      var offsetX = Math.floor((screenWidth - boardWidth) / 2);
      this.setData({
        cellSize: cellSize,
        canvasWidth: boardWidth,
        canvasHeight: boardHeight,
        offsetX: offsetX,
        offsetY: 0,
      });
    },

    _initCanvas() {
      var self = this;
      var query = this.createSelectorQuery();
      query.select("#gameBoard").fields({ node: true }, function (res) {
        if (!res) return;
        self._canvas = res.node;
        self._ctx = self._canvas.getContext("2d");
        var dpr = wx.getWindowInfo().pixelRatio;
        self._canvas.width = self.data.canvasWidth * dpr;
        self._canvas.height = self.data.canvasHeight * dpr;
        self._ctx.scale(dpr, dpr);

        // Also get position info for touch calculation
        var posQuery = self.createSelectorQuery();
        posQuery.select("#gameBoard").boundingClientRect(function (rect) {
          if (rect) {
            self._offsetX = rect.left;
            self._offsetY = rect.top;
          }
        }).exec();

        self._drawBoard();
      }).exec();
    },

    onTouchStart(e) {
      var self = this;
      this._touchStartTime = Date.now();
      this._lastTouch = e.touches[0];
      if (this._longPressTimer) clearTimeout(this._longPressTimer);
      this._longPressTimer = setTimeout(function () {
        self._isLongPress = true;
        self._handleLongPress();
      }, 300);
    },

    onTouchEnd(e) {
      if (this._longPressTimer) {
        clearTimeout(this._longPressTimer);
        this._longPressTimer = null;
      }
      if (!this._isLongPress && this._lastTouch) {
        this._handleTap();
      }
      this._isLongPress = false;
    },

    _getCellXY(touch) {
      var cellSize = this.data.cellSize;
      var x = touch.x;
      var y = touch.y;
      var col = Math.floor(x / cellSize);
      var row = Math.floor(y / cellSize);
      var rows = this.properties.rows;
      var cols = this.properties.cols;
      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return null;
      }
      return { row: row, col: col };
    },

    _handleTap() {
      var cell = this._getCellXY(this._lastTouch);
      if (cell) {
        this.triggerEvent("cell", cell);
      }
    },

    _handleLongPress() {
      var cell = this._getCellXY(this._lastTouch);
      if (cell) {
        this.triggerEvent("celllong", cell);
      }
    },

    _drawBoard() {
      if (!this._ctx) return;
      var ctx = this._ctx;
      var board = this.properties.board;
      var rows = this.properties.rows;
      var cols = this.properties.cols;
      var cellSize = this.data.cellSize;
      var isGameOver = this.properties.gameOver;

      if (!cellSize) return;

      ctx.clearRect(0, 0, cols * cellSize, rows * cellSize);

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var cell = board[r] && board[r][c];
          var x = c * cellSize;
          var y = r * cellSize;
          var cx = x + cellSize / 2;
          var cy = y + cellSize / 2;

          if (!cell) continue;

          if (!cell.isRevealed && !isGameOver) {
            ctx.fillStyle = cell.isFlagged ? COLORS.coveredHover : COLORS.covered;
            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            ctx.strokeStyle = "#90A4AE";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            if (cell.isFlagged) {
              ctx.fillStyle = COLORS.flag;
              ctx.font = "bold " + Math.floor(cellSize * 0.5) + "px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("\u{1F6A9}", cx, cy + 1);
            }
          } else {
            if (cell.isMine) {
              ctx.fillStyle = COLORS.mine;
              ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
              ctx.fillStyle = "#FFFFFF";
              ctx.font = Math.floor(cellSize * 0.5) + "px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("\u{1F4A3}", cx, cy + 1);
            } else {
              ctx.fillStyle = COLORS.revealed;
              ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
              ctx.strokeStyle = "#D5D8DC";
              ctx.lineWidth = 0.5;
              ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
              if (cell.adjacentMines > 0) {
                var numColor = NUMBER_COLORS[cell.adjacentMines] || "#000";
                ctx.fillStyle = numColor;
                ctx.font = "bold " + Math.floor(cellSize * 0.5) + "px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(cell.adjacentMines), cx, cy + 1);
              }
            }
          }
        }
      }
    },
  },

  _canvas: null,
  _ctx: null,
  _offsetX: 0,
  _offsetY: 0,
  _longPressTimer: null,
  _isLongPress: false,
  _lastTouch: null,
  _touchStartTime: 0,
});
