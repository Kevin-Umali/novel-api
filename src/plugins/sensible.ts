import fp from "fastify-plugin";

import type { CustomPluginOptions } from "../types/plugins";
import sensible from "@fastify/sensible";

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(sensible, {
    ...opts.sensible,
  });
});
