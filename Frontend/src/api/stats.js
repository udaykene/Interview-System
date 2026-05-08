import axiosInstance from "../lib/axios";

export const statsApi = {
  getStats: async (username) => {
    const res = await axiosInstance.get(`/stats${username ? `?username=${username}` : ""}`);
    return res.data;
  },
  getActivity: async (username) => {
    const res = await axiosInstance.get(`/stats/activity${username ? `?username=${username}` : ""}`);
    return res.data;
  },
  getHistory: async (username, page = 1, limit = 20) => {
    const res = await axiosInstance.get(`/stats/history?page=${page}&limit=${limit}${username ? `&username=${username}` : ""}`);
    return res.data;
  },
};
