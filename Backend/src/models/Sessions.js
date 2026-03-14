import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    problemId: {
      type: String,
      default: null,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    joinCode: {
      type: String,
      unique: true,
      required: true,
    },
    // Stream video call ID
    callId: {
      type: String,
      default: "",
    },
    // Collaborative code state
    sharedCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      java: { type: String, default: "" },
    },
    selectedLanguage: {
      type: String,
      enum: ["javascript", "python", "java"],
      default: "javascript",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
