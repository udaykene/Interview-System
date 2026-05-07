import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { playlistsApi } from "../api/playlists";

export const usePlaylists = () => {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: playlistsApi.list,
  });
};

export const usePlaylist = (id) => {
  return useQuery({
    queryKey: ["playlist", id],
    queryFn: () => playlistsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePlaylist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: playlistsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Playlist created");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create playlist"),
  });
};

export const useUpdatePlaylist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => playlistsApi.update(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["playlists"] });
      qc.invalidateQueries({ queryKey: ["playlist", data.playlist._id] });
      toast.success("Playlist updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update playlist"),
  });
};

export const useDeletePlaylist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: playlistsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Playlist deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete playlist"),
  });
};

export const useAddProblemToPlaylist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, problemId }) => playlistsApi.addProblem(playlistId, problemId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["playlists"] });
      qc.invalidateQueries({ queryKey: ["playlist", data.playlist._id] });
      toast.success("Added to playlist");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add problem"),
  });
};

export const useRemoveProblemFromPlaylist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, problemId }) => playlistsApi.removeProblem(playlistId, problemId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["playlists"] });
      qc.invalidateQueries({ queryKey: ["playlist", data.playlist._id] });
      toast.success("Removed from playlist");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to remove problem"),
  });
};
