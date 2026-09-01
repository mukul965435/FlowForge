import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
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
      enum: ["OWNER", "ADMIN", "MANAGER", "MEMBER"],
      default: "MEMBER",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INVITED", "SUSPENDED"],
      default: "ACTIVE",
      required: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

// 😈 SYSTEM DESIGN: Compound unique index prevents duplicate membership records for the same user in an organization
membershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

// Index for efficient user organization lookups
membershipSchema.index({ userId: 1, status: 1 });

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;
