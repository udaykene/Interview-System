import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
});

const StudyPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    sections: [SectionSchema],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isOfficial: {
      type: Boolean,
      default: false,
      index: true,
    },
    color: {
      type: String,
      default: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    },
    icon: {
      type: String,
      default: "BookOpen",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

const StudyPlan = mongoose.model("StudyPlan", StudyPlanSchema);

export default StudyPlan;
