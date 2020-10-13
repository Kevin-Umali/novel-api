# Welcome to Novel API
![Node](https://img.shields.io/badge/Node-v12.18.0-blue?style=for-the-badge)
![Express](https://img.shields.io/badge/Express--blue?style=for-the-badge)
![Cheerio](https://img.shields.io/badge/Cheerio--blue?style=for-the-badge)
- An open REST API for light, wuxia and web novel related.
> **REST API Link: ![REST API](https://kooma-api.herokuapp.com/boxnovel?page=1)**
# Sources
Request for more website.
| Site                            | Can Search | Status |
| --------------------------------| :--------: | :----: |
| http://boxnovel.com             |     ✔     |    ✔   |
| https://wuxiaworld.site/            |          |    ⌛   |

# Documentation
- **GET: /boxnovel?page=[page]**
```
{
  "status": "Sucess",
  "statusCode": "200",
  "results": "626 ",
  "nextPage": "https://kooma-api.herokuapp.com/boxnovel?page=2",
  "prevPage": null,
  "data": [
    {
      "title": "My Senior Brother is Too Steady",
      "link": "https://kooma-api.herokuapp.com/boxnovel/novels/my-senior-brother-is-too-steady/",
      "rating": "4.2",
      "newChapter": "Chapter 194",
      "updateOn": "1 min ago"
    },
    {
    }
 }
```

- **GET: /boxnovel/search?s=[s]&page=[page]**
```
{
  "status": "Sucess",
  "statusCode": "200",
  "results": "19 ",
  "nextPage": "https://kooma-api.herokuapp.com/boxnovel/search?s=demons&page=2",
  "prevPage": null,
  "data": [
    {
      "title": "The Indomitable Master of Elixirs-Webnovel",
      "img": "https://boxnovel.com/wp-content/uploads/2019/07/The-Indomitable-Master-of-Elixirs-193x278.jpg",
      "link": "https://kooma-api.herokuapp.com/boxnovel/novel/the-indomitable-master-of-elixirs-webnovel/",
      "rating": "4.2",
      "newChapter": "Chapter 1122",
      "updateOn": "2020-10-13 14:35:46"
    },
    {
    }
 }
```

- **GET: /boxnovel/novels?title=[title]**
```
{
  "status": "Success",
  "statusCode": "200",
  "data": {
    "title": "World’s Greatest Militia",
    "img": "https://boxnovel.com/wp-content/uploads/2019/11/Worlds-Greatest-Militia-193x278.jpg",
    "rating": "4.6",
    "author": "Calten Park,칼튼90",
    "genre": "Action,Adventure,Fantasy,Horror,Sci-fi,Supernatural",
    "release": "2018",
    "novelstatus": "OnGoing",
    "description": "The moment when mercenary leader Kwang Hwi..."
  },
  "chapter": [
    {
      "title": "Chapter 44 - 44. Use It",
      "link": "https://kooma-api.herokuapp.com/boxnovel/novels/worlds-greatest-militia/chapter-44",
      "rating": "January 29, 2020"
    },
    {
    }
 }
```

- **GET: /boxnovel/novels/:title/:chapter**
```
{
  "status": "Sucess",
  "statusCode": "200",
  "nextChapter": "https://kooma-api.herokuapp.com/boxnovel/novels/worlds-greatest-militia/chapter-4",
  "prevChapter": "https://kooma-api.herokuapp.com/boxnovel/novels/worlds-greatest-militia/chapter-2",
  "content": "3. Monster Kwang Hwi carefully aimed his gun towards the faint........"
 }
```
