import { useQuery } from "@tanstack/react-query";
import { submissionsApi } from "../api/submissions";

export const useSubmissionsForProblem = (problemId) => {
  return useQuery({
    queryKey: ["submissions", problemId],
    queryFn: () => submissionsApi.getForProblem(problemId),
    enabled: !!problemId,
  });
};
