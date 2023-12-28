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
      new URL(url);
      const page = await browser.newPage();
      fastify.log.info("New page created");
      page.setDefaultNavigationTimeout(opts.timeout?.timer ?? 30000);
      page.setDefaultTimeout(opts.timeout?.timer ?? 10000);
      await page.setViewport({ width: 1080, height: 1024 });

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (["image", "stylesheet", "font"].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      fastify.log.info("Navigating to " + url);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      fastify.log.info("Running scripts on the page");
      return page;
    },
  });

  fastify.addHook("onClose", async () => {
    await browser.close();
  });
});
