import fp from "fastify-plugin";

import type { CustomPluginOptions } from "../types/plugins";
import etag from "@fastify/etag";

// {
//   weak: false
// }

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  await fastify.register(etag, {
    ...opts.etag,
  });
});
