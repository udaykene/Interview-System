import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/stats";

export const useUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: statsApi.getStats,
  });
};

export const useUserActivity = () => {
  return useQuery({
    queryKey: ["userActivity"],
    queryFn: statsApi.getActivity,
  });
};

export const useUserHistory = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["userHistory", page, limit],
    queryFn: () => statsApi.getHistory(page, limit),
  });
};
