const express = require('express');
const router = express.Router();
const scrape = require('../scraper/boxnovelScraper');
router.get('/', async (req, res) => {
    try {
        const page = req.query.page;
        await scrape.Scrape(page, function (response) {
            res.send(response);
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: "500",
            results: "",
            nextPage: "",
            prevPage: "",
            data: []
        });
    }
});

router.get('/search', async (req, res) => {
    try {
        const search = req.query.s;
        const page = req.query.page;

        await scrape.ScrapeSearch(search, page, function (response) {
            res.send(response);
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: "500",
            results: "",
            nextPage: "",
            prevPage: "",
            data: []
        });
    }
});

router.get('/novels', async (req, res) => {
    try {
        const title = req.query.title;

        await scrape.ScrapeNovelDetails(title, function (response) {
            res.send(response);
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: "500",
            data: {
                title: "",
                img: "",
                rating: "",
                author: "",
                genre: "",
                release: "",
                novelstatus: "",
                description: "",
            },
            chapter: []
        });
    }
});

router.get('/novels/:title/:chapter', async (req, res) => {
    try {
        const title = req.params.title;
        const chapter = req.params.chapter

        await scrape.ScrapeChapter(title, chapter, function (response) {
            res.send(response);
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: "500",
            nextChapter: "",
            prevChapter: "",
            content: ""
        });
    }
});

module.exports = router;