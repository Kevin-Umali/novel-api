import fp from "fastify-plugin";

import type { CustomPluginOptions } from "../types/plugins";
import helmet from "@fastify/helmet";

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(helmet, {
    ...opts.helmet,
  });
});
