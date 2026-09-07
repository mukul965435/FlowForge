import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [2, "Team name must be at least 2 characters"],
      maxlength: [50, "Team name cannot exceed 50 characters"],
    },

    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for listing teams within an organization efficiently
teamSchema.index({ organizationId: 1, archivedAt: 1 });

const Team = mongoose.model("Team", teamSchema);

export default Team;
