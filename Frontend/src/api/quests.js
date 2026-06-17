import axiosInstance from "../lib/axios";

export const questsApi = {
  // User endpoints
  getQuests: async () => {
    const res = await axiosInstance.get("/quests");
    return res.data;
  },
  claimDaily: async () => {
    const res = await axiosInstance.post("/quests/claim-daily");
    return res.data;
  },
  claimWeekly: async (bountyId) => {
    const res = await axiosInstance.post(`/quests/claim-weekly/${bountyId}`);
    return res.data;
  },
  claimAdminQuest: async (questId) => {
    const res = await axiosInstance.post(`/quests/claim-quest/${questId}`);
    return res.data;
  },

  // Admin Quest CRUD
  listAdminQuests: async () => {
    const res = await axiosInstance.get("/quests/admin");
    return res.data;
  },
  createQuest: async (payload) => {
    const res = await axiosInstance.post("/quests/admin", payload);
    return res.data;
  },
  updateQuest: async (id, payload) => {
    const res = await axiosInstance.put(`/quests/admin/${id}`, payload);
    return res.data;
  },
  deleteQuest: async (id) => {
    const res = await axiosInstance.delete(`/quests/admin/${id}`);
    return res.data;
  },

  // Admin Badge CRUD
  listBadges: async () => {
    const res = await axiosInstance.get("/quests/badges");
    return res.data;
  },
  createBadge: async (payload) => {
    const res = await axiosInstance.post("/quests/badges", payload);
    return res.data;
  },
  deleteBadge: async (id) => {
    const res = await axiosInstance.delete(`/quests/badges/${id}`);
    return res.data;
  },
};
