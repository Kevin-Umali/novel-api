import type {
  FastifyError,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import {
  getNovelChapter,
  getNovelDetails,
  getNovelList,
  searchNovel,
} from "../../controller/boxnovel.controller";
import {
  NovelQuery,
  NovelQuerySchema,
  NovelQueryWithRequiredLink,
  NovelQueryWithRequiredLinkSchema,
  NovelQueryWithRequiredSearch,
  NovelQueryWithRequiredSearchSchema,
} from "../../schema/boxnovel.schema";

const boxnovel: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get(
    "/boxnovel",
    {
      schema: {
        querystring: NovelQuerySchema,
      },
    },
    (
      request: FastifyRequest<{ Querystring: NovelQuery }>,
      reply: FastifyReply
    ) => getNovelList(fastify, request, reply)
  );
  fastify.get(
    "/boxnovel/details",
    {
      schema: {
        querystring: NovelQueryWithRequiredLinkSchema,
      },
    },
    (
      request: FastifyRequest<{ Querystring: NovelQueryWithRequiredLink }>,
      reply: FastifyReply
    ) => getNovelDetails(fastify, request, reply)
  );
  fastify.get(
    "/boxnovel/chapter",
    {
      schema: {
        querystring: NovelQueryWithRequiredLinkSchema,
      },
    },
    (
      request: FastifyRequest<{ Querystring: NovelQueryWithRequiredLink }>,
      reply: FastifyReply
    ) => getNovelChapter(fastify, request, reply)
  );
  fastify.get(
    "/boxnovel/search",
    {
      schema: {
        querystring: NovelQueryWithRequiredSearchSchema,
      },
    },
    (
      request: FastifyRequest<{ Querystring: NovelQueryWithRequiredSearch }>,
      reply: FastifyReply
    ) => searchNovel(fastify, request, reply)
  );
};

export default boxnovel;
