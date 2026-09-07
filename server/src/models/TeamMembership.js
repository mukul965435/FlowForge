import mongoose from "mongoose";

const teamMembershipSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["LEAD", "MEMBER"],
      default: "MEMBER",
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// 😈 SYSTEM DESIGN: Compound unique index prevents duplicate team memberships
teamMembershipSchema.index({ teamId: 1, userId: 1 }, { unique: true });

const TeamMembership = mongoose.model("TeamMembership", teamMembershipSchema);

export default TeamMembership;
