const request = require('request-promise');
const cheerio = require('cheerio');

async function Scrape(page, callback) {
    const link = `https://boxnovel.com/novel/page/${page}`;
    let novelArray = {
        status: "Sucess",
        statusCode: "200",
        results: "",
        nextPage: "",
        prevPage: "",
        data: []
    };
    await request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const novels = $('.page-listing-item').find('.page-item-detail');

            novelArray.results = $('.c-blog__heading')
                .find('h4')
                .text()
                .replace(/\s\s+/g, '')
                .replace('results', '');

            novelArray.prevPage = ($('.nav-links')
                    .find('.nav-next')
                    .find('a')
                    .attr('href') != null && page != 1) ?
                `https://kooma-api.herokuapp.com/boxnovel?page=${(parseInt(page) - 1).toString()}` : null;

            novelArray.nextPage = ($('.nav-links')
                    .find('.nav-previous')
                    .find('a')
                    .attr('href') != null) ?
                `https://kooma-api.herokuapp.com/boxnovel?page=${(parseInt(page) + 1).toString()}` : null;

            novels.each((i, el) => {
                const title = $(el)
                    .find('h5')
                    .text()
                    .replace(/\s\s+/g, '')
                    .replace('NEW', '')
                    .replace('HOT', '');

                const link = `https://kooma-api.herokuapp.com/boxnovel/novels?title=${$(el)
                    .find('h5')
                    .children('a')
                    .attr('href').replace('https://boxnovel.com/novel/', '').replace('/', '')}`;

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

            return callback(novelArray);
        }
    });
};

async function ScrapeSearch(query, page, callback) {
    let searchLink = `https://boxnovel.com/page/${page}/?s=${query}&post_type=wp-manga`;
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

            novelArray.prevPage = ($('.nav-links')
                    .find('.nav-next')
                    .find('a')
                    .attr('href') != null && page != 1) ?
                `https://kooma-api.herokuapp.com/boxnovel/search?s=${query}&page=${(parseInt(page) + 1).toString()}` : null;

            novelArray.nextPage = ($('.nav-links')
                    .find('.nav-previous')
                    .find('a')
                    .attr('href') != null) ?
                `https://kooma-api.herokuapp.com/boxnovel/search?s=${query}&page=${(parseInt(page) + 1).toString()}` : null;

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

                const link = `https://kooma-api.herokuapp.com/boxnovel/novels?title=${$(el)
                    .find('h4')
                    .children('a')
                    .attr('href').replace('https://boxnovel.com/novel/', '').replace('/', '')}`;

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

            return callback(novelArray);
        }
    });
}

async function ScrapeNovelDetails(title, callback) {
    let titleLink = `https://boxnovel.com/novel/${title.toLowerCase().replace(/\s/g, '-')}`;
    let novelArray = {
        status: "Success",
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
                    "link": `https://kooma-api.herokuapp.com/boxnovel/novels/${chapterlink.replace('https://boxnovel.com/novel/', '')}`,
                    "rating": realeasedate,
                });
            });

            return callback(novelArray);
        }
    });
}

async function ScrapeChapter(title, chapter, callback) {
    const link = `https://boxnovel.com/novel/${title}/${chapter}`;
    let novelArray = {
        status: "Sucess",
        statusCode: "200",
        nextChapter: "",
        prevChapter: "",
        content: ""
    }
    await request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const chapterlist = $('.entry-content').find('.reading-content').find('p');

            const chapterPrev = $('.nav-links')
                .find('.nav-next')
                .find('a')
                .attr('href');
            const _chapterPrev = chapterPrev.substr(chapterPrev.indexOf("chapter"), chapterPrev.length);

            const chapterNext = $('.nav-links')
                .find('.nav-previous')
                .find('a')
                .attr('href');
            const _chapterNext = chapterNext.substr(chapterNext.indexOf("chapter"), chapterNext.length);

            novelArray.nextChapter = (chapterPrev != null) ?
                `https://kooma-api.herokuapp.com/boxnovel/novels/${title}/${_chapterPrev}` : null;

            novelArray.prevChapter = (chapterNext != null) ?
                `https://kooma-api.herokuapp.com/boxnovel/novels/${title}/${_chapterNext}` : null;

            chapterlist.each((i, el) => {
                const content = $(el)
                    .text();

                novelArray.content = `${novelArray.content}\r\n${content}`;
            });

            return callback(novelArray);
        }
    });
}

module.exports = {
    Scrape,
    ScrapeSearch,
    ScrapeNovelDetails,
    ScrapeChapter
};