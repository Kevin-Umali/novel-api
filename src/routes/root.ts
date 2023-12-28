import type { FastifyPluginAsync } from "fastify";
import { HealthcheckResponseSchema, RootResponseSchema } from "../schema/root.schema";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get(
    "/healthcheck",
    {
      schema: {
        response: {
          200: HealthcheckResponseSchema,
        },
      },
    },
    async (_request, _reply) => {
      return { status: "OK", version: "2.0.0", timestamp: new Date().toISOString() };
    },
  );

  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: RootResponseSchema,
        },
      },
    },
    async (_request, _reply) => ({
      intro: "Welcome to our Novel API",
      providers: [
        {
          name: "Boxnovel",
          intro: "Welcome to the Boxnovel provider: check out the provider's website @ https://boxnovel.com/",
          route: "/novel/boxnovel",
          routes: ["/boxnovel", "/boxnovel/details", "/boxnovel/chapter", "/boxnovel/search"],
        },
        { name: "Wuxiaworld", intro: "Welcome to the Wuxiaworld provider: check out the provider's website @ https://wuxiaworld.site/", route: "/novel/wuxiaworld", routes: [], status: "in progress" },
      ],
      documentation: "/documentation",
    }),
  );
};

export default root;
