import { DIFFICULTY_PRESETS } from "../../utils/constants";

Page({
  data: {
    difficultyList: [
      { key: "easy", label: DIFFICULTY_PRESETS.easy.label, desc: "9×9 格子 · 10 颗雷" },
      { key: "medium", label: DIFFICULTY_PRESETS.medium.label, desc: "16×16 格子 · 40 颗雷" },
      { key: "hard", label: DIFFICULTY_PRESETS.hard.label, desc: "16×30 格子 · 99 颗雷" },
    ],
  },

  onStartGame(e) {
    const difficulty = e.currentTarget.dataset.diff;
    wx.navigateTo({
      url: `/pages/game/game?difficulty=${difficulty}`,
    });
  },
});
