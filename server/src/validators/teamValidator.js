import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTeamSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Team name is required" })
      .min(2, "Team name must be at least 2 characters")
      .max(50, "Team name cannot exceed 50 characters"),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  }),
  params: z.object({
    orgId: z.string().regex(objectIdRegex, "Invalid organization ID").optional(),
  }),
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(500).optional(),
  }),
  params: z.object({
    teamId: z.string().regex(objectIdRegex, "Invalid team ID"),
  }),
});

export const addTeamMemberSchema = z.object({
  body: z.object({
    userId: z.string().regex(objectIdRegex, "Invalid user ID"),
    role: z.enum(["LEAD", "MEMBER"]).default("MEMBER"),
  }),
  params: z.object({
    teamId: z.string().regex(objectIdRegex, "Invalid team ID"),
  }),
});

export const updateTeamMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["LEAD", "MEMBER"], {
      required_error: "Role is required",
    }),
  }),
  params: z.object({
    teamId: z.string().regex(objectIdRegex, "Invalid team ID"),
    userId: z.string().regex(objectIdRegex, "Invalid user ID"),
  }),
});
