import { z } from "zod";

export const createOrgSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Organization name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(50, "Slug cannot exceed 50 characters")
      .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens")
      .optional(),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  }),
});

export const updateOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    logo: z.string().url("Logo must be a valid URL").optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
  }),
});

export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["OWNER", "ADMIN", "MANAGER", "MEMBER"], {
      required_error: "Role is required",
    }),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  }),
});

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).default("MEMBER"),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
  }),
});
