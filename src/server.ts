import closeWithGrace from "close-with-grace";
import * as dotenv from "dotenv";
import Fastify from "fastify";

import app from "./app";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { executablePath } from "puppeteer";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const server = Fastify({
  logger: {
    enabled: process.env.LOGGER_ENABLED === "true" || false,
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
  pluginTimeout: 40000,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.withTypeProvider<ZodTypeProvider>();

server.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    reply.status(error.statusCode ?? 400).send({
      statusCode: error.statusCode,
      code: error.code,
      error: "Bad Request",
      message: error.issues || error.errors,
    });
  } else {
    reply.internalServerError();
  }
});

void server.register(app, {
  etag: { weak: false },
  puppeteer: !isProduction
    ? { headless: false, executablePath: executablePath() }
    : {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH!,
        args: ["--disable-setuid-sandbox", "--no-sandbox", "--single-process", "--no-zygote", "--disable-gpu"],
      },
  cors: { origin: "*" },
  rateLimit: {
    max: 100,
    timeWindow: "1 minute",
  },
  env: {
    confKey: "config",
    schema: {
      type: "object",
      required: ["PORT"],
      properties: {
        PORT: {
          type: "string",
          default: 3000,
        },
      },
    },
    dotenv: true,
  },
  caching: {
    privacy: "public",
    expiresIn: 86400, // 1 day in seconds
  },
});

const closeListeners = closeWithGrace({ delay: 500 }, async (opts: any) => {
  if (opts.err) {
    server.log.error(opts.err);
  }

  server.log.info("Closing server...");

  await server.close();
});

server.addHook("onClose", (_instance, done) => {
  closeListeners.uninstall();
  done();
});

void server.listen({
  port: Number(process.env.PORT ?? 3000),
  host: !isProduction ? process.env.SERVER_HOSTNAME ?? "127.0.0.1" : "0.0.0.0",
});

server.ready((err: Error | null) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.info("All routes loaded! Check your console for the route details.");

  console.info(server.printRoutes());

  server.log.info(`Server listening on port ${Number(process.env.PORT ?? 3000)}`);
});

export { server as app };
