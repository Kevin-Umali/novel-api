import fp from "fastify-plugin";

import type { Page, Browser } from "puppeteer";
import type { CustomPluginOptions } from "../types/plugins";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

export default fp<CustomPluginOptions>(async (fastify, opts) => {
  const browser: Browser = await puppeteer.launch(opts.puppeteer);

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
