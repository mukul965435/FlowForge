import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Project name must be at least 2 characters"],
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },

    key: {
      type: String,
      required: [true, "Project key is required"],
      uppercase: true,
      trim: true,
      minlength: [2, "Project key must be at least 2 characters"],
      maxlength: [10, "Project key cannot exceed 10 characters"],
      match: [/^[A-Z0-9]+$/, "Project key must contain only uppercase alphanumeric characters"],
    },

    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ARCHIVED"],
      default: "ACTIVE",
      required: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
      index: true,
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

// 😈 SYSTEM DESIGN: Compound unique index ensures project keys are unique PER ORGANIZATION
projectSchema.index({ organizationId: 1, key: 1 }, { unique: true });

// Index for efficient project filtering by status within an organization
projectSchema.index({ organizationId: 1, status: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
