import axiosInstance from "../lib/axios";

export const statsApi = {
  getStats: async () => {
    const res = await axiosInstance.get("/stats");
    return res.data;
  },
  getActivity: async () => {
    const res = await axiosInstance.get("/stats/activity");
    return res.data;
  },
  getHistory: async (page = 1, limit = 20) => {
    const res = await axiosInstance.get(`/stats/history?page=${page}&limit=${limit}`);
    return res.data;
  },
};
