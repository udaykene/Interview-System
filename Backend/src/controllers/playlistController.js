import Playlist from "../models/Playlist.js";

/**
 * GET /api/playlists
 * List all playlists for the current user.
 */
export async function listPlaylists(req, res) {
  try {
    const playlists = await Playlist.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("problems", "title slug difficulty category tags");
    res.status(200).json({ playlists });
  } catch (error) {
    console.error("Error in listPlaylists:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/playlists
 * Create a new playlist.
 */
export async function createPlaylist(req, res) {
  try {
    const { name, description, isPublic } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const existing = await Playlist.findOne({ userId: req.user._id, name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "A playlist with this name already exists" });
    }

    const playlist = await Playlist.create({
      userId: req.user._id,
      name: name.trim(),
      description: description?.trim() || "",
      isPublic: Boolean(isPublic),
      problems: [],
    });

    res.status(201).json({ playlist });
  } catch (error) {
    console.error("Error in createPlaylist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUT /api/playlists/:id
 * Update playlist name/description.
 */
export async function updatePlaylist(req, res) {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.findOne({ _id: id, userId: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (name !== undefined) playlist.name = name.trim();
    if (description !== undefined) playlist.description = description.trim();
    if (isPublic !== undefined) playlist.isPublic = Boolean(isPublic);

    await playlist.save();
    res.status(200).json({ playlist });
  } catch (error) {
    console.error("Error in updatePlaylist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * DELETE /api/playlists/:id
 * Delete a playlist.
 */
export async function deletePlaylist(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Playlist.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Playlist not found" });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error in deletePlaylist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/playlists/:id/problems
 * Add a problem to a playlist.
 * Body: { problemId }
 */
export async function addProblemToPlaylist(req, res) {
  try {
    const { id } = req.params;
    const { problemId } = req.body;
    if (!problemId) return res.status(400).json({ message: "problemId is required" });

    const playlist = await Playlist.findOne({ _id: id, userId: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (playlist.problems.includes(problemId)) {
      return res.status(200).json({ playlist, message: "Problem already in playlist" });
    }

    playlist.problems.push(problemId);
    await playlist.save();

    res.status(200).json({ playlist });
  } catch (error) {
    console.error("Error in addProblemToPlaylist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * DELETE /api/playlists/:id/problems/:problemId
 * Remove a problem from a playlist.
 */
export async function removeProblemFromPlaylist(req, res) {
  try {
    const { id, problemId } = req.params;

    const playlist = await Playlist.findOne({ _id: id, userId: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.problems = playlist.problems.filter(
      (pid) => pid.toString() !== problemId
    );
    await playlist.save();

    res.status(200).json({ playlist });
  } catch (error) {
    console.error("Error in removeProblemFromPlaylist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
