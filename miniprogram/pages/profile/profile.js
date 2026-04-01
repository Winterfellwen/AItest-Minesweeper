Page({
  data: {
    nickname: "Anonymous",
    avatar: "",
  },

  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        nickname: userInfo.nickname || "Anonymous",
        avatar: userInfo.avatar_url || "",
      });
    }
  },
});
