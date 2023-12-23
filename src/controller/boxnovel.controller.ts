import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  NovelQuery,
  NovelQueryWithRequiredLink,
  NovelQueryWithRequiredSearch,
} from "../schema/boxnovel.schema";

async function getNovelList(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Querystring: NovelQuery }>,
  reply: FastifyReply
) {
  try {
    const { orderBy = "latest", page = "1" } = request.query;

    fastify.log.info(
      `Fetching novel list for order: ${orderBy} and page: ${page}`
    );

    const url =
      page === "1"
        ? `https://boxnovel.com/novel/?m_orderby=${orderBy}`
        : `https://boxnovel.com/novel/page/${page}/?m_orderby=${orderBy}`;

    const puppeteerPage = await fastify.puppeteer.getPage(url);

    fastify.log.info(`Puppeteer page opened for URL: ${url}`);

    const pageTitle = await puppeteerPage.title();

    fastify.log.info(`pageTitle: ${pageTitle}`);

    const cardDetails = await puppeteerPage.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".page-listing-item"));
      return items.flatMap((item) => {
        const novelsInItem = Array.from(
          item.querySelectorAll(".col-12.col-md-6.badge-pos-1")
        );
        return novelsInItem.map((novel) => {
          const titleElement = novel.querySelector(".post-title h3 a");
          const title = titleElement?.textContent;
          const link = titleElement ? titleElement.getAttribute("href") : null;

          const imgElement = novel.querySelector("a img");
          const imgSrc = imgElement ? imgElement.getAttribute("src") : null;

          const rating = novel
            .querySelector(".post-total-rating .total_votes")
            ?.textContent?.trim();
          const newChapterElement = novel.querySelector(
            ".list-chapter .chapter-item .chapter a"
          );
          const newChapterLink = newChapterElement
            ? newChapterElement.getAttribute("href")
            : null;
          const updatedTime = novel
            .querySelector(".list-chapter .chapter-item .post-on")
            ?.textContent?.trim();

          return {
            title,
            link,
            imgSrc,
            rating,
            newChapterLink,
            updatedTime,
          };
        });
      });
    });

    fastify.log.info(
      `Scraped ${cardDetails.length} novel card details and page title`
    );

    await puppeteerPage.close();

    fastify.log.info("Puppeteer page closed.");

    reply.send({ title: pageTitle, novels: cardDetails });
  } catch (error) {
    fastify.log.error(error);
    reply.internalServerError();
  }
}

async function getNovelDetails(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Querystring: NovelQueryWithRequiredLink }>,
  reply: FastifyReply
) {
  try {
    const { link } = request.query;

    fastify.log.info(`Fetching novel details`);

    const puppeteerPage = await fastify.puppeteer.getPage(link);

    fastify.log.info(`Puppeteer page opened for URL: ${link}`);

    const details = await puppeteerPage.evaluate(() => {
      const imgSrc = document
        .querySelector(".summary_image img")
        ?.getAttribute("src");
      const title = document.querySelector(".rate-title")?.textContent?.trim();
      const rating = document
        .getElementById("averagerate")
        ?.textContent?.trim();
      const author = document
        .querySelector(".author-content a")
        ?.textContent?.trim();
      const genres = Array.from(
        document.querySelectorAll(".genres-content a")
      ).map((el) => el?.textContent?.trim());
      const status = document
        .querySelector(".post-status .post-content_item .summary-content")
        ?.textContent?.trim();

      const summary = document
        .querySelector(".description-summary .summary__content .g_txt_over p")
        ?.textContent?.trim();

      const chapters = Array.from(
        document.querySelectorAll(".wp-manga-chapter a")
      ).map((el) => ({
        title: el?.textContent?.trim(),
        link: el.getAttribute("href") ?? null,
      }));

      return {
        title,
        summary,
        rating,
        author,
        genres,
        status,
        imgSrc,
        chapters,
      };
    });

    fastify.log.info(`Scraped novel details`);

    await puppeteerPage.close();

    fastify.log.info("Puppeteer page closed.");

    reply.send(details);
  } catch (error) {
    fastify.log.error(error);
    reply.internalServerError();
  }
}

async function getNovelChapter(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Querystring: NovelQueryWithRequiredLink }>,
  reply: FastifyReply
) {
  try {
    const { link } = request.query;

    fastify.log.info(`Fetching novel chapter `);

    const puppeteerPage = await fastify.puppeteer.getPage(link);

    fastify.log.info(`Puppeteer page opened for URL: ${link}`);

    const chapter = await puppeteerPage.evaluate(() => {
      const nextLink =
        document
          .querySelector(".nav-links .nav-next a")
          ?.getAttribute("href") ?? null;

      const prevLink =
        document
          .querySelector(".nav-links .nav-previous a")
          ?.getAttribute("href") ?? null;

      const content = document.querySelector(
        ".entry-content .reading-content .text-left"
      )?.textContent;

      return { link: { nextLink, prevLink }, content };
    });

    fastify.log.info(`Scraped chapters`);

    await puppeteerPage.close();

    fastify.log.info("Puppeteer page closed.");

    reply.send(chapter);
  } catch (error) {
    fastify.log.error(error);
    reply.internalServerError();
  }
}

async function searchNovel(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Querystring: NovelQueryWithRequiredSearch }>,
  reply: FastifyReply
) {
  try {
    const { title, orderBy, page = "1" } = request.query;

    fastify.log.info(
      `Fetching novel list for search: ${title}, order: ${orderBy} and page: ${page}`
    );

    const url =
      page === "1"
        ? `https://boxnovel.com/?s=${title}&post_type=wp-manga&m_orderby=${orderBy}`
        : `https://boxnovel.com/page/${page}/?s=${title}&post_type=wp-manga&m_orderby=${orderBy}`;

    const puppeteerPage = await fastify.puppeteer.getPage(url);

    fastify.log.info(`Puppeteer page opened for URL: ${url}`);

    const pageTitle = await puppeteerPage.title();

    const cardDetails = await puppeteerPage.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll(".row.c-tabs-item__content")
      );
      return rows.map((row) => {
        const titleElement = row.querySelector(".post-title a");
        const title = titleElement?.textContent;
        const link = titleElement ? titleElement.getAttribute("href") : null;
        const imgSrc =
          row.querySelector(".tab-thumb img")?.getAttribute("src") ?? null;
        const rating = row.querySelector(
          ".post-total-rating .total_votes"
        )?.textContent;
        const newChapterLink =
          row.querySelector(".latest-chap a")?.getAttribute("href") ?? null;
        const updatedTime = row.querySelector(
          ".post-on .font-meta"
        )?.textContent;

        return { title, link, imgSrc, rating, newChapterLink, updatedTime };
      });
    });

    fastify.log.info(
      `Scraped ${cardDetails.length} novel card details and page title`
    );

    puppeteerPage.close();

    fastify.log.info("Puppeteer page closed.");

    reply.send({ title: pageTitle, novels: cardDetails });
  } catch (error) {
    fastify.log.error(error);
    reply.internalServerError();
  }
}

export { getNovelList, getNovelDetails, getNovelChapter, searchNovel };
