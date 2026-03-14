import axiosInstance from "../lib/axios";

export const problemsApi = {
  list: async () => {
    const res = await axiosInstance.get("/problems");
    return res.data;
  },
  getBySlug: async (slug) => {
    const res = await axiosInstance.get(`/problems/${slug}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await axiosInstance.post("/problems", payload);
    return res.data;
  },
  update: async (slug, payload) => {
    const res = await axiosInstance.put(`/problems/${slug}`, payload);
    return res.data;
  },
  remove: async (slug) => {
    const res = await axiosInstance.delete(`/problems/${slug}`);
    return res.data;
  },
};
