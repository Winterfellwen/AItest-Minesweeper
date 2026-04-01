import { GameEngine } from "../../utils/game-engine";
import { DIFFICULTY_PRESETS } from "../../utils/constants";
import { submitScore } from "../../utils/api";

Page({
  data: {
    board: [],
    rows: 9,
    cols: 9,
    totalMines: 10,
    difficulty: "easy",
    remainingMines: 10,
    timeDisplay: "00:00",
    isGameOver: false,
    showDialog: false,
    isWin: false,
    showFireworks: false,
    currentScore: 0,
    boardReady: false,
  },

  engine: null,
  timerId: null,
  seconds: 0,

  onLoad(options) {
    const diff = options.difficulty || "easy";
    const preset = DIFFICULTY_PRESETS[diff];
    this.engine = new GameEngine(preset.rows, preset.cols, preset.mines);
    this.setData({
      difficulty: diff,
      rows: preset.rows,
      cols: preset.cols,
      totalMines: preset.mines,
      remainingMines: preset.mines,
      boardReady: true,
      board: this.engine.getBoard(),
    });
    this.startTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  onCellTap(e) {
    if (this.data.isGameOver) return;
    const { row, col } = e.detail;
    const result = this.engine.revealCell(row, col);
    this.setData({ board: this.engine.getBoard() });

    if (result.gameOver && !result.isWin) {
      this.lose();
    } else if (result.isWin) {
      this.win();
    }
  },

  onCellLongPress(e) {
    if (this.data.isGameOver) return;
    const { row, col } = e.detail;
    this.engine.toggleFlag(row, col);
    this.setData({
      board: this.engine.getBoard(),
      remainingMines: this.data.totalMines - this.engine.getFlagCount(),
    });
  },

  startTimer() {
    this.seconds = 0;
    this.timerId = setInterval(() => {
      this.seconds++;
      const m = Math.floor(this.seconds / 60);
      const s = this.seconds % 60;
      this.setData({
        timeDisplay: m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0"),
      });
    }, 1000);
  },

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  win() {
    this.stopTimer();
    var score = Math.max(0, 10000 - this.seconds * 100);
    this.setData({
      isGameOver: true,
      isWin: true,
      currentScore: score,
      showFireworks: true,
    });

    try {
      submitScore({
        difficulty: this.data.difficulty,
        time_seconds: this.seconds,
      });
    } catch (e) {
      console.error("Score submit failed:", e);
    }

    var self = this;
    setTimeout(function () {
      self.setData({ showDialog: true, showFireworks: false });
    }, 3000);
  },

  lose() {
    this.stopTimer();
    this.engine.revealAll();
    var self = this;
    setTimeout(function () {
      self.setData({
        isGameOver: true,
        isWin: false,
        board: self.engine.getBoard(),
      });
      setTimeout(function () {
        self.setData({ showDialog: true });
      }, 500);
    }, 100);
  },

  restartGame() {
    var preset = DIFFICULTY_PRESETS[this.data.difficulty];
    this.engine = new GameEngine(preset.rows, preset.cols, preset.mines);
    this.stopTimer();
    this.setData({
      difficulty: this.data.difficulty,
      rows: preset.rows,
      cols: preset.cols,
      totalMines: preset.mines,
      remainingMines: preset.mines,
      board: this.engine.getBoard(),
      remainingMines: preset.mines,
      isGameOver: false,
      showDialog: false,
      showFireworks: false,
      isWin: false,
      boardReady: true,
    });
    this.setData({ remainingMines: this.data.totalMines });
    this.startTimer();
  },

  closeDialog() {
    this.setData({ showDialog: false });
  },

  goLeaderboard() {
    wx.switchTab({ url: "/pages/leaderboard/leaderboard" });
  },

  onReady() {},
});
