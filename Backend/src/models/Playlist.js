import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      maxlength: 300,
    },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// A user can't have two playlists with the same name
PlaylistSchema.index({ userId: 1, name: 1 }, { unique: true });

const Playlist = mongoose.model("Playlist", PlaylistSchema);

export default Playlist;
