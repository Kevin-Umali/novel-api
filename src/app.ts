import type { FastifyPluginAsync } from "fastify";
import { join } from "path";

import type { CustomPluginOptions } from "./types/plugins";
import AutoLoad from "@fastify/autoload";

const app: FastifyPluginAsync<CustomPluginOptions> = async (
  fastify,
  opts
): Promise<void> => {
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
