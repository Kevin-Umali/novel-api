import type { FastifyPluginAsync, FastifyReply, FastifyRequest, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { getNovelChapter, getNovelDetails, getNovelList, searchNovel } from "../../controller/boxnovel.controller";
import {
  BoxnovelRouteInterface,
  BaseNovelSchema,
  NovelQuerySchema,
  NovelQueryWithRequiredLink,
  NovelQueryWithRequiredLinkSchema,
  NovelQueryWithRequiredSearch,
  NovelQueryWithRequiredSearchSchema,
  NovelDetailsResponseSchema,
  NovelChapterResponse,
  BaseNovelResponse,
} from "../../schema/boxnovel.schema";

const boxnovel: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get(
    "/boxnovel",
    {
      schema: {
        querystring: NovelQuerySchema,
        response: {
          200: BaseNovelSchema,
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
    ) => getNovelChapter(fastify, request, reply),
  );
  fastify.get(
    "/boxnovel/search",
    {
      schema: {
        querystring: NovelQueryWithRequiredSearchSchema,
        response: {
          200: BaseNovelSchema,
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
