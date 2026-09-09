import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Project name is required" })
      .min(2, "Project name must be at least 2 characters")
      .max(100, "Project name cannot exceed 100 characters"),
    key: z
      .string()
      .min(2, "Key must be at least 2 characters")
      .max(10, "Key cannot exceed 10 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Key must contain only alphanumeric characters")
      .transform((val) => val.toUpperCase())
      .optional(),
    description: z.string().max(1000, "Description cannot exceed 1000 characters").optional(),
    teamId: z.string().regex(objectIdRegex, "Invalid team ID").optional(),
  }),
  params: z.object({
    orgId: z.string().regex(objectIdRegex, "Invalid organization ID").optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
    teamId: z.string().regex(objectIdRegex, "Invalid team ID").nullable().optional(),
  }),
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
  }),
});

export const getProjectsQuerySchema = z.object({
  query: z.object({
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
    teamId: z.string().regex(objectIdRegex, "Invalid team ID").optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
