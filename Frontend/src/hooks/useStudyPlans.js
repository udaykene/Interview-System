import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { studyPlansApi } from "../api/studyPlans";

export const useStudyPlans = () => {
  return useQuery({
    queryKey: ["study-plans"],
    queryFn: studyPlansApi.list,
  });
};

export const useStudyPlan = (slug) => {
  return useQuery({
    queryKey: ["study-plan", slug],
    queryFn: () => studyPlansApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateStudyPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studyPlansApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["study-plans"] });
      toast.success("Study plan created");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create study plan"),
  });
};

export const useUpdateStudyPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => studyPlansApi.update(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["study-plans"] });
      qc.invalidateQueries({ queryKey: ["study-plan", data.studyPlan.slug] });
      toast.success("Study plan updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update study plan"),
  });
};

export const useDeleteStudyPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studyPlansApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["study-plans"] });
      toast.success("Study plan deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete study plan"),
  });
};
