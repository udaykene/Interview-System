import axiosInstance from "../lib/axios";

export const submissionsApi = {
  getForProblem: async (problemId) => {
    const res = await axiosInstance.get(`/execute/submissions/${problemId}`);
    return res.data;
  },
};
