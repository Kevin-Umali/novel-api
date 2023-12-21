import type { PuppeteerLaunchOptions } from "puppeteer";
import type { FastifyCorsOptions } from "@fastify/cors";
import type { FastifyEnvOptions } from "@fastify/env";
import type { FastifyEtagOptions } from "@fastify/etag";
import type { FastifyHelmetOptions } from "@fastify/helmet";
import type { RateLimitOptions } from "@fastify/rate-limit";
import type { SensibleOptions } from "@fastify/sensible";
import type { FastifyCompressOptions } from "@fastify/compress";

export interface CustomPluginOptions {
  puppeteer?: PuppeteerLaunchOptions;
  cors?: FastifyCorsOptions;
  env?: FastifyEnvOptions;
  etag?: FastifyEtagOptions;
  helmet?: FastifyHelmetOptions;
  rateLimit?: RateLimitOptions;
  sensible?: SensibleOptions;
  compress?: FastifyCompressOptions;
  // Add other plugin options as needed
}
