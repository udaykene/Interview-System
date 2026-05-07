import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    language: {
      type: String,
      enum: ["javascript", "python", "java"],
      required: true,
    },
    code: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Execution Error", "Compilation Error", "Runtime Error"],
      required: true,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for activity graph queries (submissions per day)
SubmissionSchema.index({ userId: 1, createdAt: -1 });
// Index for checking if a problem is solved
SubmissionSchema.index({ userId: 1, problemId: 1, status: 1 });

const Submission = mongoose.model("Submission", SubmissionSchema);

export default Submission;
