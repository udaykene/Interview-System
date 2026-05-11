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

export const useUpdateProblem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }) => problemsApi.update(slug, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      qc.invalidateQueries({ queryKey: ["problem"] });
      toast.success("Problem updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update problem"),
  });
};

export const useBulkImportProblems = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: problemsApi.bulkImport,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      const { created = 0, updated = 0, skipped = 0, invalid = 0 } = data.summary || {};
      toast.success(`Import finished: ${created} created, ${updated} updated, ${skipped} skipped, ${invalid} invalid`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to import problems"),
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

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: problemsApi.toggleFavorite,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success(data.isFavorited ? "Added to favorites" : "Removed from favorites");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to toggle favorite"),
  });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: problemsApi.getFavorites,
  });
};
