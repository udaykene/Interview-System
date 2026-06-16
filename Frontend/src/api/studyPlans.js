import axiosInstance from "../lib/axios";

export const studyPlansApi = {
  list: async () => {
    const res = await axiosInstance.get("/study-plans");
    return res.data;
  },
  getBySlug: async (slug) => {
    const res = await axiosInstance.get(`/study-plans/${slug}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await axiosInstance.post("/study-plans", payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await axiosInstance.put(`/study-plans/${id}`, payload);
    return res.data;
  },
  remove: async (id) => {
    const res = await axiosInstance.delete(`/study-plans/${id}`);
    return res.data;
  },
};
