import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { problemsApi } from "../api/problems";

export const useProblems = () => {
  return useQuery({
    queryKey: ["problems"],
    queryFn: problemsApi.list,
  });
};

export const useProblem = (slug) => {
  return useQuery({
    queryKey: ["problem", slug],
    queryFn: () => problemsApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateProblem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: problemsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem created");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create problem"),
  });
};

export const useDeleteProblem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: problemsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete problem"),
  });
};
