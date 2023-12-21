import closeWithGrace from "close-with-grace";
import * as dotenv from "dotenv";
import Fastify from "fastify";

import app from "./app";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const server = Fastify({
  logger: !isProduction,
});

void server.register(app);

const closeListeners = closeWithGrace({ delay: 500 }, async (opts: any) => {
  if (opts.err) {
    server.log.error(opts.err);
  }

  await server.close();
});

server.addHook("onClose", (_instance, done) => {
  closeListeners.uninstall();
  done();
});

void server.listen({
  port: Number(process.env.PORT ?? 3000),
  host: process.env.SERVER_HOSTNAME ?? "127.0.0.1",
});

server.ready((err: Error | null) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.info(
    "All routes loaded! Check your console for the route details."
  );

  console.log(server.printRoutes());

  server.log.info(
    `Server listening on port ${Number(process.env.PORT ?? 3000)}`
  );
});

export { server as app };
