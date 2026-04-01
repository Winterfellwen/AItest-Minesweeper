import { wechatLogin } from "./api";

export async function login() {
  try {
    const token = wx.getStorageSync("token");
    if (token) return true;

    const { code } = await new Promise((resolve) => wx.login({ success: resolve }));
    const res = await wechatLogin(code);
    wx.setStorageSync("token", res.token);
    wx.setStorageSync("userInfo", res.user);
    return true;
  } catch (e) {
    console.error("Login failed:", e);
    return false;
  }
}
