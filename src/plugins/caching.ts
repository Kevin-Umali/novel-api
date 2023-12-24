import fp from "fastify-plugin";
import caching from "@fastify/caching";
import type { CustomPluginOptions } from "../types/plugins";

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(caching, {
    ...opts.caching,
  });
});
