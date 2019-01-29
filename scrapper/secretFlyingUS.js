const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const url = "https://www.secretflying.com/usa-deals/";

requestPromise(url)
  .then(function(entireWebsiteHtml) {
    const result = cheerio(
      ".snews-loop-wrap > .snews-classic-blog-hentry > .article-content-wrapper",
      entireWebsiteHtml
    );

    //console.log(result);

    const flyResults = [];

    result.map(i => {
      let title = cheerio(
        ".snews-loop-wrap > .snews-classic-blog-hentry > .article-content-wrapper > .entry-title",
        entireWebsiteHtml
      )
        .eq(i)
        .text();

      //console.log(title);
      let description = cheerio(
        ".snews-loop-wrap > .snews-classic-blog-hentry > .article-content-wrapper > p",
        entireWebsiteHtml
      ).text();

      //console.log(description);
      let articleUrl = cheerio(
        ".snews-loop-wrap > .snews-classic-blog-hentry > .article-content-wrapper > .entry-title > a",
        entireWebsiteHtml
      )[i].attribs.href;

      //console.log(articleUrl);
      let imageUrl = cheerio(
        ".snews-loop-wrap > .snews-classic-blog-hentry > .article-content-wrapper > .entry-img > .img-frame > a:nth-child(2) > img",
        entireWebsiteHtml
      )[i].attribs.src;

      //console.log(imageUrl);
      let brand = "secretFlyingUS";
      let status = 0;

      let offertObject = {
        offertTitle: title,
        offertDescription: description,
        offertUrl: articleUrl,
        offertImageUrl: `<img src="${imageUrl}" alt="secretFlyingUS"/>`,
        brand: brand,
        type: "Flights",
        country: "USA",
        status: status,
        confirmed_brand: 1
      };

      flyResults.push(offertObject);
    });

    flyResults.map(singleFlyResult => {
      const options = {
        method: "POST",
        uri: "http://127.0.0.1:8080/api/storeOffer",
        body: {
          title: singleFlyResult.offertTitle,
          description: singleFlyResult.offertDescription,
          long_description: "-",
          page_url: singleFlyResult.offertUrl,
          img_url: singleFlyResult.offertImageUrl,
          brand: singleFlyResult.brand,
          country: singleFlyResult.country,
          type: singleFlyResult.type,
          status: singleFlyResult.status,
          confirmed_brand: singleFlyResult.confirmed_brand
        },
        json: true
      };

      requestPromise(options)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  })
  .catch(function(err) {
    console.log(err);
  });
