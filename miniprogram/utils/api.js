import { API_BASE } from "./constants";

function request({ url, method, data, auth = true }) {
  return new Promise((resolve, reject) => {
    const header = {
      "Content-Type": "application/json",
    };
    if (auth) {
      const token = wx.getStorageSync("token");
      if (token) {
        header["Authorization"] = `Bearer ${token}`;
      }
    }

    wx.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header,
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

export function wechatLogin(code) {
  return request({
    url: "/api/auth/login/",
    method: "POST",
    data: { code },
    auth: false,
  });
}

export function submitScore(data) {
  return request({
    url: "/api/scores/submit/",
    method: "POST",
    data,
  });
}

export function fetchLeaderboard(difficulty, limit = 50) {
  return request({
    url: `/api/scores/leaderboard/?difficulty=${difficulty}&limit=${limit}`,
    method: "GET",
    auth: false,
  });
}

export function getProfile() {
  return request({
    url: "/api/auth/me/",
    method: "GET",
  });
}
