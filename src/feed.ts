export default async function getFeed(){

    let Parser = require('rss-parser');
    let parser = new Parser();
    
    let feed = await parser.parseURL('https://res.stj.jus.br/hrestp-c-portalp/RSS.xml');
    let jfeed = JSON.parse(JSON.stringify(feed.items));

    let rss = {
  
        img0: () => {
            if(jfeed[0].hasOwnProperty("enclosure")){
                if(jfeed[0].enclosure.hasOwnProperty("url")){
                    return jfeed[0].enclosure.url
                }
            }
            else {return null}
        }, 
        img1:() => {
            if(jfeed[1].hasOwnProperty("enclosure")){
                if(jfeed[1].enclosure.hasOwnProperty("url")){
                    return jfeed[1].enclosure.url
                }
            }
            else {return null}
        }, 
        img2:() => {
            if(jfeed[2].hasOwnProperty("enclosure")){
                if(jfeed[2].enclosure.hasOwnProperty("url")){
                    return jfeed[2].enclosure.url
                }
            }
            else {return null}
        },
        title0: jfeed[0].title ,
        title1: jfeed[1].title ,
        title2: jfeed[2].title ,
        pubData0: jfeed[0].pubDate,
        pubData1: jfeed[1].pubDate,
        pubData2: jfeed[2].pubDate,
        link0: jfeed[0].link,
        link1: jfeed[1].link,
        link2: jfeed[2].link,
        pres0:() => {
            if(jfeed[0].hasOwnProperty("enclosure")){
                if(jfeed[0].enclosure.hasOwnProperty("url")){
                    return true
                }
            }
            else {return false}
        },
        pres1:() => {
            if(jfeed[1].hasOwnProperty("enclosure")){
                if(jfeed[1].enclosure.hasOwnProperty("url")){
                    return true
                }
            }
            else {return false}
        },
        pres2:() => {
            if(jfeed[2].hasOwnProperty("enclosure")){
                if(jfeed[2].enclosure.hasOwnProperty("url")){
                    return true
                }
            }
            else {return false}
        } 
    }

    return rss;

}