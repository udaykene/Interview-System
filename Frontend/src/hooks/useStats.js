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

export const useUserHistory = (usernameOrPage, pageOrLimit = 1, maybeLimit = 20) => {
  const username = typeof usernameOrPage === "string" ? usernameOrPage : undefined;
  const page = typeof usernameOrPage === "number" ? usernameOrPage : pageOrLimit;
  const limit = typeof usernameOrPage === "number" ? maybeLimit : maybeLimit;

  return useQuery({
    queryKey: ["userHistory", username, page, limit],
    queryFn: () => statsApi.getHistory(username, page, limit),
  });
};
