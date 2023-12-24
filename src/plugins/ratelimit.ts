import fp from "fastify-plugin";

import type { CustomPluginOptions } from "../types/plugins";
import rateLimit from "@fastify/rate-limit";

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(rateLimit, {
    ...opts.rateLimit,
  });
});
