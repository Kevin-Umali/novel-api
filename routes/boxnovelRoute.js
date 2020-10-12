const request = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const link = `https://boxnovel.com/novel/page/${req.query.page}`;
        let novelArray = {
            status: "Sucess",
            statusCode: "200",
            results: "",
            nextPage: "",
            prevPage: "",
            data: []
        }
        await request(link, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const novels = $('.page-listing-item').find('.page-item-detail');

                novelArray.results = $('.c-blog__heading')
                    .find('h4')
                    .text()
                    .replace(/\s\s+/g, '')
                    .replace('results', '');

                novelArray.prevPage = $('.nav-links')
                    .find('.nav-next').find('a').attr('href');

                novelArray.nextPage = $('.nav-links')
                    .find('.nav-previous').find('a').attr('href');

                novels.each((i, el) => {
                    const title = $(el)
                        .find('h5')
                        .text()
                        .replace(/\s\s+/g, '')
                        .replace('NEW', '')
                        .replace('HOT', '');

                    const link = $(el)
                        .find('h5')
                        .children('a')
                        .attr('href');

                    const rating = $(el)
                        .find('.post-total-rating')
                        .text()
                        .replace(/\s\s+/g, '');

                    const newChapter = $(el)
                        .find('.chapter')
                        .first()
                        .text()
                        .replace(/\s\s+/g, '');

                    const updateOn = $(el)
                        .find('.post-on')
                        .first()
                        .text()
                        .replace(/\s\s+/g, '');

                    novelArray.data.push({
                        "title": title,
                        "link": link,
                        "rating": rating,
                        "newChapter": newChapter,
                        "updateOn": updateOn
                    });
                });

                res.send(novelArray);
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: "500",
            data: []
        });
    }
});

router.get('/search', async (req, res) => {
    try {
        let searchLink = `https://boxnovel.com/?s=${req.query.query}&post_type=wp-manga`;
        let novelArray = {
            status: "Sucess",
            statusCode: "200",
            results: "",
            nextPage: "",
            prevPage: "",
            data: []
        }
        await request(searchLink, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const novels = $('.c-tabs-item').find('.c-tabs-item__content');

                novelArray.results = $('.c-blog__heading')
                    .find('h4')
                    .text()
                    .replace(/\s\s+/g, '')
                    .replace('results', '');

                novelArray.prevPage = $('.nav-links')
                    .find('.nav-next').find('a').attr('href');

                novelArray.nextPage = $('.nav-links')
                    .find('.nav-previous').find('a').attr('href');


                novels.each((i, el) => {
                    const title = $(el)
                        .find('h4')
                        .text()
                        .replace(/\s\s+/g, '')
                        .replace('NEW', '')
                        .replace('HOT', '');

                    const img = $(el)
                        .find('img')
                        .attr('src');

                    const link = $(el)
                        .find('h4')
                        .children('a')
                        .attr('href');

                    const rating = $(el)
                        .find('.post-total-rating')
                        .text()
                        .replace(/\s\s+/g, '');

                    const newChapter = $(el)
                        .find('.chapter')
                        .first()
                        .text()
                        .replace(/\s\s+/g, '');

                    const updateOn = $(el)
                        .find('.post-on')
                        .first()
                        .text()
                        .replace(/\s\s+/g, '');

                    novelArray.data.push({
                        "title": title,
                        "img": img,
                        "link": link,
                        "rating": rating,
                        "newChapter": newChapter,
                        "updateOn": updateOn
                    });
                });

                res.send(novelArray);
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: "500",
            data: []
        });
    }
});

router.get('/novels', async (req, res) => {
    try {
        let titleLink = `https://boxnovel.com/novel/${req.query.title}`;
        let novelArray = {
            status: "Success (Details)",
            statusCode: "200",
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
        }
        await request(titleLink, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
        
                novelArray.data.title = $('.post-title')
                    .find('h3')
                    .text()
                    .replace(/\s\s+/g, '')
                    .replace('NEW', '');
        
                novelArray.data.img = $('.summary_image')
                    .find('img')
                    .attr('src');
        
                novelArray.data.rating = $('.summary_content')
                    .find('.post-total-rating')
                    .text()
                    .replace(/\s\s+/g, '');
        
                novelArray.data.author = $('.author-content')
                    .text()
                    .replace(/\s\s+/g, '');
        
                novelArray.data.genre = $('.genres-content')
                    .text()
                    .replace(/\s\s+/g, '');
        
                novelArray.data.release = $('.post-status')
                    .find('.summary-content')
                    .first()
                    .text()
                    .replace(/\s\s+/g, '');
        
                novelArray.data.novelstatus = $('.post-status')
                    .find('.summary-content')
                    .last()
                    .text()
                    .replace(/\s\s+/g, '');
        
                novelArray.data.description = $('.description-summary')
                    .text()
                    .replace(/\s\s+/g, '')
                    .replace('Description', '');
        
                const chapterlist = $('.listing-chapters_wrap').find('.wp-manga-chapter');
        
                chapterlist.each((i, el) => {
                    const chaptername = $(el)
                        .find('a')
                        .text()
                        .replace(/\s\s+/g, '');
        
                    const chapterlink = $(el)
                        .find('a')
                        .attr('href');
        
                    const realeasedate = $(el)
                        .find('.chapter-release-date')
                        .text()
                        .replace(/\s\s+/g, '');
        
                    novelArray.chapter.push({
                        "title": chaptername,
                        "link": chapterlink,
                        "rating": realeasedate,
                    });
                });
        
                res.send(novelArray);
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: "500",
            data: {},
            chapter: []
        });
    }
});

module.exports = router;