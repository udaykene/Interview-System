import axiosInstance from "../lib/axios";

export const playlistsApi = {
  list: async () => {
    const res = await axiosInstance.get("/playlists");
    return res.data;
  },
  create: async (payload) => {
    const res = await axiosInstance.post("/playlists", payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await axiosInstance.put(`/playlists/${id}`, payload);
    return res.data;
  },
  remove: async (id) => {
    const res = await axiosInstance.delete(`/playlists/${id}`);
    return res.data;
  },
  addProblem: async (playlistId, problemId) => {
    const res = await axiosInstance.post(`/playlists/${playlistId}/problems`, { problemId });
    return res.data;
  },
  removeProblem: async (playlistId, problemId) => {
    const res = await axiosInstance.delete(`/playlists/${playlistId}/problems/${problemId}`);
    return res.data;
  },
};
