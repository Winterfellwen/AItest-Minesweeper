import { login } from "./utils/auth";

App({
  globalData: {
    userInfo: null,
  },

  onLaunch() {
    login().then((ok) => {
      if (ok) {
        this.globalData.userInfo = wx.getStorageSync("userInfo");
      }
    });
  },
});
