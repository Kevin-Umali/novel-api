import type { FastifyPluginAsync } from "fastify";
import { join } from "path";

import type { CustomPluginOptions } from "./types/plugins";
import AutoLoad from "@fastify/autoload";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

const app: FastifyPluginAsync<CustomPluginOptions> = async (fastify, opts): Promise<void> => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Novel API - Enhanced Edition",
        description: "An upgraded REST API for light, wuxia, and web novels, now powered by Fastify and Puppeteer for improved performance and reliability.",
        version: "2.0.0",
      },
      externalDocs: {
        url: "https://github.com/Kevin-Umali/novel-api",
        description: "GitHub Repository",
      },
      tags: [
        { name: "boxnovel", description: "BoxNovel related end-points" },
        { name: "wuxiaworld", description: "Wuxiaworld related end-points" },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    uiHooks: {
      onRequest(_request, _reply, next) {
        next();
      },
      preHandler(_request, _reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecificationClone: true,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
  });
};

export default app;
export { app };
