import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    description: {
      text: { type: String, default: "" },
      notes: [{ type: String }],
    },
    examples: [
      {
        input: { type: String, default: "" },
        output: { type: String, default: "" },
        explanation: { type: String, default: "" },
      },
    ],
    constraints: [{ type: String }],
    starterCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      java: { type: String, default: "" },
    },
    solutionCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      java: { type: String, default: "" },
    },
    testCases: [
      {
        input: { type: String, default: "" },
        expectedOutput: { type: String, default: "" },
        isHidden: { type: Boolean, default: false },
      },
    ],
    functionName: {
      type: String,
      default: "solution",
    },
    tags: [{ type: String }],
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    successfulSubmissions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;
