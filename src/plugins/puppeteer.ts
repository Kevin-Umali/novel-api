import fp from "fastify-plugin";

import type { Page } from "puppeteer";
import type { CustomPluginOptions } from "../types/plugins";
import puppeteer from "puppeteer";

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  const browser = await puppeteer.launch(opts.puppeteer);

  fastify.decorate("puppeteer", {
    browser,
    getPage: async (url: string): Promise<Page> => {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1024 });
      await page.goto(url);
      return page;
    },
  });

  fastify.addHook("onClose", async () => {
    await browser.close();
  });
});
