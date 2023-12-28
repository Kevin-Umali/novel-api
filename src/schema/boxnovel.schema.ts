import { z } from "zod";

export const NovelQuerySchema = z.object({
  orderBy: z.enum(["latest", "alphabet", "rating", "trending", "views", "new-manga"]).optional().default("latest"),
  page: z.string().optional().default("1"),
});

export const NovelQueryWithRequiredLinkSchema = z.object({
  link: z.string().url(),
});

export const NovelQueryWithRequiredSearchSchema = NovelQuerySchema.extend({
  title: z.string(),
});

export type NovelQuery = z.infer<typeof NovelQuerySchema>;
export type NovelQueryWithRequiredLink = z.infer<typeof NovelQueryWithRequiredLinkSchema>;
export type NovelQueryWithRequiredSearch = z.infer<typeof NovelQueryWithRequiredSearchSchema>;

export const NovelListResponseSchema = z.object({
  title: z.string(),
  link: z.string(),
  imgSrc: z.string().url().nullable().optional().default(null),
  rating: z.string().nullable().optional().default(null),
  newChapterLink: z.string().url().nullable().optional().default(null),
  updatedTime: z.string().nullable().optional().default(null),
});

export const BaseNovelResponseSchema = z.object({
  title: z.string().nullable().optional().default(null),
  novels: z.array(NovelListResponseSchema).default([]),
  total: z.string().nullable().optional().default(null),
  page: z.string().nullable().optional().default(null),
});

export const NovelDetailsResponseSchema = z.object({
  title: z.string().nullable().default(null),
  summary: z.string().nullable().default(null),
  rating: z.string().nullable().default(null),
  author: z.string().nullable().default(null),
  genres: z.array(z.string()).nullable().default(null),
  status: z.string().nullable().default(null),
  imgSrc: z.string().url().nullable().default(null),
  chapters: z
    .array(
      z.object({
        title: z.string().nullable().default(null),
        link: z.string().url().nullable().default(null),
      }),
    )
    .nullable()
    .default([]),
});

export const NovelChapterResponseSchema = z.object({
  link: z
    .object({
      nextLink: z.string().url().nullable().default(null),
      prevLink: z.string().url().nullable().default(null),
    })
    .default({}),
  content: z.string().nullable().default(null),
});

export type BaseNovelResponse = z.infer<typeof BaseNovelResponseSchema>;
export type NovelChapterResponse = z.infer<typeof NovelChapterResponseSchema>;
export type NovelDetailsResponse = z.infer<typeof NovelDetailsResponseSchema>;

export interface BoxnovelRouteInterface {
  Querystring: NovelQuery | NovelQueryWithRequiredLink | NovelQueryWithRequiredSearch;
  Reply: BaseNovelResponse | NovelChapterResponse | NovelDetailsResponse;
}
