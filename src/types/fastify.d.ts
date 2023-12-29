import { Browser, Page } from "puppeteer";

declare module "fastify" {
  interface FastifyInstance {
    puppeteer: {
      browser: Browser;
      getPage: (url: string, selector?: string) => Promise<Page>;
    };
  }
}
