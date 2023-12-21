import fp from "fastify-plugin";

import type { CustomPluginOptions } from "../types/plugins";
import cors from "@fastify/cors";

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(cors, {
    ...opts.cors,
  });
});
