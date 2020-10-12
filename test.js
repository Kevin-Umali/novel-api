const request = require('request');
const cheerio = require('cheerio');
const link = 'https://boxnovel.com/novel/worlds-greatest-militia/';


let novelArray = {
    status: "Sucess",
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
request(link, function (error, response, html) {
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

        console.log(novelArray);
    }
});