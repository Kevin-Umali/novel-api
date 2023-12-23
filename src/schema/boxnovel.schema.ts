import { z } from "zod";

export const NovelQuerySchema = z.object({
  orderBy: z
    .enum(["latest", "alphabet", "rating", "trending", "views", "new-manga"])
    .optional()
    .default("latest"),
  page: z.string().optional().default("1"),
  title: z.string().optional(),
  link: z.string().optional(),
});

export const NovelQueryWithRequiredLinkSchema = NovelQuerySchema.extend({
  link: z.string(),
});

export const NovelQueryWithRequiredSearchSchema = NovelQuerySchema.extend({
  title: z.string(),
});

export type NovelQuery = z.infer<typeof NovelQuerySchema>;
export type NovelQueryWithRequiredLink = z.infer<
  typeof NovelQueryWithRequiredLinkSchema
>;
export type NovelQueryWithRequiredSearch = z.infer<
  typeof NovelQueryWithRequiredSearchSchema
>;
