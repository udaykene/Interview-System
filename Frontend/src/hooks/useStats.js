import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/stats";

export const useUserStats = (username) => {
  return useQuery({
    queryKey: ["userStats", username],
    queryFn: () => statsApi.getStats(username),
  });
};

export const useUserActivity = (username) => {
  return useQuery({
    queryKey: ["userActivity", username],
    queryFn: () => statsApi.getActivity(username),
  });
};

export const useUserHistory = (username, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["userHistory", username, page, limit],
    queryFn: () => statsApi.getHistory(username, page, limit),
  });
};
