import type { FastifyPluginAsync } from "fastify";

const boxnovel: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get("/", async (_request, reply) => {
    const page = await fastify.puppeteer.getPage("https://boxnovel.com/");
    // Perform actions on the page or extract information as needed
    const pageTitle = await page.title(); // Example: get the page title

    await page.close(); // Don't forget to close the page
    reply.send({ title: pageTitle });
  });
};

export default boxnovel;
