import type { FastifyPluginAsync, FastifyReply, FastifyRequest, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { getNovelChapter, getNovelDetails, getNovelList, searchNovel } from "../../controller/wuxiaworld.controller";
import {
  NovelQueryWithRequiredLink,
  NovelQueryWithRequiredSearch,
  NovelChapterResponse,
  BaseNovelResponse,
  NovelRouteInterface,
  NovelChapterResponseSchema,
  NovelDetailsResponseSchema,
  NovelQuerySchema,
  NovelQueryWithRequiredLinkSchema,
  NovelQueryWithRequiredSearchSchema,
  BaseNovelResponseSchema,
} from "../../schema/novel.schema";

const wuxiaworld: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get(
    "/wuxiaworld",
    {
      schema: {
        tags: ["wuxiaworld"],
        summary: "List all novels",
        description: "This endpoint lists all novels, providing basic information like title, link, and image for each novel.",
        querystring: NovelQuerySchema,
        response: {
          200: BaseNovelResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: NovelQueryWithRequiredSearch;
        Reply: BaseNovelResponse;
      }>,
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, NovelRouteInterface>,
    ) => getNovelList(fastify, request, reply),
  );
  fastify.get(
    "/wuxiaworld/details",
    {
      schema: {
        tags: ["wuxiaworld"],
        summary: "Fetch details of a specific novel",
        description: "This endpoint provides detailed information about a novel including chapters and ratings based on the provided novel link.",
        querystring: NovelQueryWithRequiredLinkSchema,
        response: {
          200: NovelDetailsResponseSchema,
        },
      },
    },
    (
      request: FastifyRequest<{
        Querystring: NovelQueryWithRequiredLink;
        Reply: NovelChapterResponse;
      }>,
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, NovelRouteInterface>,
    ) => getNovelDetails(fastify, request, reply),
  );
  fastify.get(
    "/wuxiaworld/chapter",
    {
      schema: {
        tags: ["wuxiaworld"],
        summary: "Retrieve a specific novel chapter",
        description: "This endpoint fetches the content of a specific chapter of a novel, identified by the provided novel link.",
        querystring: NovelQueryWithRequiredLinkSchema,
        response: {
          200: NovelChapterResponseSchema,
        },
      },
    },
    (
      request: FastifyRequest<{
        Querystring: NovelQueryWithRequiredLink;
        Reply: NovelChapterResponse;
      }>,
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, NovelRouteInterface>,
    ) => getNovelChapter(fastify, request, reply),
  );
  fastify.get(
    "/wuxiaworld/search",
    {
      schema: {
        tags: ["wuxiaworld"],
        summary: "Search for novels",
        description: "This endpoint allows users to search for novels by title, returning a list of novels that match the search criteria.",
        querystring: NovelQueryWithRequiredSearchSchema,
        response: {
          200: BaseNovelResponseSchema,
        },
      },
    },
    (
      request: FastifyRequest<{
        Querystring: NovelQueryWithRequiredSearch;
        Reply: BaseNovelResponse;
      }>,
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, NovelRouteInterface>,
    ) => searchNovel(fastify, request, reply),
  );
};

export default wuxiaworld;
