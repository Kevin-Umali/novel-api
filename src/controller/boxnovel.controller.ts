import type { FastifyInstance, FastifyRequest, FastifyReply, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { BaseNovelResponse, BoxnovelRouteInterface, NovelChapterResponse, NovelQueryWithRequiredLink, NovelQueryWithRequiredSearch } from "../schema/boxnovel.schema";

async function getNovelList(
  fastify: FastifyInstance,
  request: FastifyRequest<{
    Querystring: NovelQueryWithRequiredSearch;
    Reply: BaseNovelResponse;
  }>,
  reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
) {
  try {
    const { orderBy = "latest", page = "1" } = request.query;

    fastify.log.info(`Fetching novel list for order: ${orderBy} and page: ${page}`);

    const url = page === "1" ? `https://boxnovel.com/novel/?m_orderby=${orderBy}` : `https://boxnovel.com/novel/page/${page}/?m_orderby=${orderBy}`;

    const puppeteerPage = await fastify.puppeteer.getPage(url);

    fastify.log.info(`Puppeteer page opened for URL: ${url}`);

    const pageTitle = await puppeteerPage.title();

    fastify.log.info(`pageTitle: ${pageTitle}`);

    const novelDetails = await puppeteerPage.evaluate(() => {
      const totalResult = document.querySelector(".c-blog__heading.style-2 div")?.textContent?.trim() ?? null;

      const items = Array.from(document.querySelectorAll(".page-listing-item"));

      const itemResult = items.flatMap((item) => {
        const novelsInItem = Array.from(item.querySelectorAll(".col-12.col-md-6.badge-pos-1"));
        return novelsInItem.map((novel) => {
          const titleElement = novel.querySelector(".post-title h3 a") as Element;
          const title = titleElement.textContent as string;
          const link = titleElement.getAttribute("href") as string;

          const imgElement = novel.querySelector("a img");
          const imgSrc = imgElement ? imgElement.getAttribute("src") : null;

          const rating = novel.querySelector(".post-total-rating .total_votes")?.textContent?.trim() ?? null;

          const newChapterElement = novel.querySelector(".list-chapter .chapter-item .chapter a");

          const newChapterLink = newChapterElement ? newChapterElement.getAttribute("href") : null;

          const updatedTime = novel.querySelector(".list-chapter .chapter-item .post-on")?.textContent?.trim() ?? null;

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

      return { totalResult, itemResult };
    });

    fastify.log.info(`Scraped ${novelDetails.itemResult.length} novel card details and page title`);

    await puppeteerPage.close();

    fastify.log.info("Puppeteer page closed.");

    reply.send({
      title: pageTitle,
      novels: novelDetails.itemResult,
      total: novelDetails.totalResult,
      page,
    });
  } catch (error) {
    fastify.log.info(error);
    fastify.log.error(error);
    reply.internalServerError();
  }
}

async function getNovelDetails(
  fastify: FastifyInstance,
  request: FastifyRequest<{
    Querystring: NovelQueryWithRequiredLink;
    Reply: NovelChapterResponse;
  }>,
  reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
) {
  try {
    const { link } = request.query;

    fastify.log.info(`Fetching novel details`);

    const puppeteerPage = await fastify.puppeteer.getPage(link);

    fastify.log.info(`Puppeteer page opened for URL: ${link}`);

    const details = await puppeteerPage.evaluate(() => {
      const imgSrc = document.querySelector(".summary_image img")?.getAttribute("src") ?? null;

      const title = document.querySelector(".rate-title")?.textContent?.trim() ?? null;

      const rating = document.getElementById("averagerate")?.textContent?.trim() ?? null;

      const author = document.querySelector(".author-content a")?.textContent?.trim() ?? null;

      const genres = Array.from(document.querySelectorAll(".genres-content a"))
        .map((el) => el.textContent?.trim())
        .filter((genre): genre is string => genre !== undefined);

      const status = document.querySelector(".post-status .post-content_item .summary-content")?.textContent?.trim() ?? null;

      const summary = document.querySelector(".description-summary .summary__content .g_txt_over p")?.textContent?.trim() ?? null;

      const chapters = Array.from(document.querySelectorAll(".wp-manga-chapter a")).map((el) => ({
        title: el?.textContent?.trim() ?? null,
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
  request: FastifyRequest<{
    Querystring: NovelQueryWithRequiredLink;
    Reply: NovelChapterResponse;
  }>,
  reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
) {
  try {
    const { link } = request.query;

    fastify.log.info(`Fetching novel chapter `);

    const puppeteerPage = await fastify.puppeteer.getPage(link);

    fastify.log.info(`Puppeteer page opened for URL: ${link}`);

    const chapter = await puppeteerPage.evaluate(() => {
      const nextLink = document.querySelector(".nav-links .nav-next a")?.getAttribute("href") ?? null;

      const prevLink = document.querySelector(".nav-links .nav-previous a")?.getAttribute("href") ?? null;

      const content = document.querySelector(".entry-content .reading-content .text-left")?.textContent ?? null;

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
  request: FastifyRequest<{ Querystring: NovelQueryWithRequiredSearch; Reply: BaseNovelResponse }>,
  reply: FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, BoxnovelRouteInterface>,
) {
  try {
    const { title, orderBy, page = "1" } = request.query;

    fastify.log.info(`Fetching novel list for search: ${title}, order: ${orderBy} and page: ${page}`);

    const url = page === "1" ? `https://boxnovel.com/?s=${title}&post_type=wp-manga&m_orderby=${orderBy}` : `https://boxnovel.com/page/${page}/?s=${title}&post_type=wp-manga&m_orderby=${orderBy}`;

    const puppeteerPage = await fastify.puppeteer.getPage(url);

    fastify.log.info(`Puppeteer page opened for URL: ${url}`);

    const pageTitle = await puppeteerPage.title();

    const cardDetails = await puppeteerPage.evaluate(() => {
      const totalResult = document.querySelector(".c-blog__heading.style-2 h1")?.textContent?.trim() ?? null;

      const rows = Array.from(document.querySelectorAll(".row.c-tabs-item__content"));

      const rowsResult = rows.map((row) => {
        const titleElement = row.querySelector(".post-title a") as Element;
        const title = titleElement.textContent as string;
        const link = titleElement.getAttribute("href") as string;

        const imgSrc = row.querySelector(".tab-thumb img")?.getAttribute("src") ?? null;

        const rating = row.querySelector(".post-total-rating .total_votes")?.textContent ?? null;

        const newChapterLink = row.querySelector(".latest-chap a")?.getAttribute("href") ?? null;

        const updatedTime = row.querySelector(".post-on .font-meta")?.textContent ?? null;

        return { title, link, imgSrc, rating, newChapterLink, updatedTime };
      });

      return { totalResult, rowsResult };
    });

    fastify.log.info(`Scraped ${cardDetails.rowsResult.length} novel card details and page title`);

    puppeteerPage.close();

    fastify.log.info("Puppeteer page closed.");

    reply.send({
      title: pageTitle,
      novels: cardDetails.rowsResult,
      total: cardDetails.totalResult,
      page,
    });
  } catch (error) {
    fastify.log.error(error);
    reply.internalServerError();
  }
}

export { getNovelList, getNovelDetails, getNovelChapter, searchNovel };
