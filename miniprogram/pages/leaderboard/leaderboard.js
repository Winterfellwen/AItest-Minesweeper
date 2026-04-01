import { fetchLeaderboard } from "../../utils/api";

Page({
  data: {
    activeTab: "easy",
    scores: [],
    loading: false,
  },

  onShow() {
    this.loadLeaderboard();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.loadLeaderboard();
  },

  loadLeaderboard() {
    this.setData({ loading: true });
    fetchLeaderboard(this.data.activeTab)
      .then((res) => {
        this.setData({ scores: res.scores || [] });
      })
      .catch((err) => {
        console.error("Failed to load leaderboard:", err);
        this.setData({ scores: [] });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
});
