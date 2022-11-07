export default async function getFeed(){

    let Parser = require('rss-parser');
    let parser = new Parser();

    let feed = await parser.parseURL('https://adrenaline.com.br/rss');
    
    let jfeed = JSON.parse(JSON.stringify(feed.items));

    let rss = { 
        img0: jfeed[0].enclosure.url, 
        img1: jfeed[1].enclosure.url, 
        img2: jfeed[2].enclosure.url,
        title0: jfeed[0].title ,
        title1: jfeed[1].title ,
        title2: jfeed[2].title ,
        pubData0: jfeed[0].pubDate,
        pubData1: jfeed[1].pubDate,
        pubData2: jfeed[2].pubDate,
        link0: jfeed[0].link,
        link1: jfeed[1].link,
        link2: jfeed[2].link
    }

    return rss;

}