import fp from "fastify-plugin";

import type { CustomPluginOptions } from "../types/plugins";
import env from "@fastify/env";

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(env, { ...opts.env });
});
