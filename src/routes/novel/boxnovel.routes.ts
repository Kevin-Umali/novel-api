import type { FastifyPluginAsync, FastifyReply, FastifyRequest, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { getNovelChapter, getNovelDetails, getNovelList, searchNovel } from "../../controller/boxnovel.controller";
import {
  NovelQueryWithRequiredLink,
  NovelQueryWithRequiredSearch,
  NovelChapterResponse,
  BaseNovelResponse,
  BoxnovelRouteInterface,
  NovelChapterResponseSchema,
  NovelDetailsResponseSchema,
  NovelQuerySchema,
  NovelQueryWithRequiredLinkSchema,
  NovelQueryWithRequiredSearchSchema,
  BaseNovelResponseSchema,
} from "../../schema/boxnovel.schema";

const boxnovel: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get(
    "/boxnovel",
    {
      schema: {
        tags: ["boxnovel"],
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
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
    ) => getNovelList(fastify, request, reply),
  );
  fastify.get(
    "/boxnovel/details",
    {
      schema: {
        tags: ["boxnovel"],
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
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
    ) => getNovelDetails(fastify, request, reply),
  );
  fastify.get(
    "/boxnovel/chapter",
    {
      schema: {
        tags: ["boxnovel"],
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
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
    ) => getNovelChapter(fastify, request, reply),
  );
  fastify.get(
    "/boxnovel/search",
    {
      schema: {
        tags: ["boxnovel"],
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
      reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
    ) => searchNovel(fastify, request, reply),
  );
};

export default boxnovel;
