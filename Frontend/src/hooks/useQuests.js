import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { questsApi } from "../api/quests";

export const useQuests = () => {
  return useQuery({
    queryKey: ["quests"],
    queryFn: questsApi.getQuests,
  });
};

export const useClaimDailyQuest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: questsApi.claimDaily,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quests"] });
      // Invalidate stats or user queries if any exist
      qc.invalidateQueries({ queryKey: ["user-stats"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(`Daily Quest Claimed! +${data.xpGained} XP`);
      if (data.newBadges && data.newBadges.length > 0) {
        data.newBadges.forEach((b) => {
          toast.success(`🏆 New Badge Unlocked: ${b.name}!`);
        });
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to claim daily quest");
    },
  });
};

export const useClaimWeeklyBounty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bountyId) => questsApi.claimWeekly(bountyId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quests"] });
      qc.invalidateQueries({ queryKey: ["user-stats"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(`Bounty Claimed! +${data.xpGained} XP`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to claim bounty");
    },
  });
};

export const useClaimAdminQuest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questId) => questsApi.claimAdminQuest(questId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quests"] });
      qc.invalidateQueries({ queryKey: ["user-stats"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(`Quest Claimed! +${data.xpGained} XP`);
      if (data.newBadges && data.newBadges.length > 0) {
        data.newBadges.forEach((b) => {
          toast.success(`🏆 New Badge Unlocked: ${b.name}!`);
        });
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to claim quest");
    },
  });
};

// Admin Quests Hooks
export const useAdminQuests = () => {
  return useQuery({
    queryKey: ["admin-quests"],
    queryFn: questsApi.listAdminQuests,
  });
};

export const useCreateQuest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: questsApi.createQuest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quests"] });
      qc.invalidateQueries({ queryKey: ["quests"] });
      toast.success("Quest created successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create quest");
    },
  });
};

export const useUpdateQuest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => questsApi.updateQuest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quests"] });
      qc.invalidateQueries({ queryKey: ["quests"] });
      toast.success("Quest updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update quest");
    },
  });
};

export const useDeleteQuest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: questsApi.deleteQuest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quests"] });
      qc.invalidateQueries({ queryKey: ["quests"] });
      toast.success("Quest deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete quest");
    },
  });
};

// Admin Badges Hooks
export const useBadges = () => {
  return useQuery({
    queryKey: ["badges"],
    queryFn: questsApi.listBadges,
  });
};

export const useCreateBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: questsApi.createBadge,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge created successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create badge");
    },
  });
};

export const useDeleteBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: questsApi.deleteBadge,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete badge");
    },
  });
};
