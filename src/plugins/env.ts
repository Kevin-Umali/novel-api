import fp from "fastify-plugin";

import type { CustomPluginOptions } from "../types/plugins";
import env from "@fastify/env";

const schema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
  },
};

const options = {
  confKey: "config",
  schema,
  dotenv: true,
};

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(env, { ...opts.env });
});
