import { z } from "zod";

export const HealthcheckResponseSchema = z.object({
  status: z.literal("OK"),
  version: z.string(),
  timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/), // ISO date-time format
});

export const ProviderSchema = z.object({
  name: z.string(),
  intro: z.string().url().optional(),
  route: z.string(),
  routes: z.array(z.string()),
  status: z.enum(["in progress", "available", "unavailable"]).optional(),
});

export const RootResponseSchema = z.object({
  intro: z.string(),
  providers: z.array(ProviderSchema),
  documentation: z.string().url(),
});
