const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const url = "https://www.travelpirates.com/flights";

requestPromise(url)
  .then(function(entireWebsiteHtml) {
    const result = cheerio(".post-list > .post-preview", entireWebsiteHtml);

    const flyResults = [];

    result.map(i => {
      let title = cheerio(
        ".post-list > .post-preview > header > h2",
        entireWebsiteHtml
      )
        .eq(i)
        .text()
        .replace("Show deal:", "")
        .replace("Expired:", "")
        .replace(/[#_/']/g, "")
        .trim();
      let description = cheerio(
        ".post-list > .post-preview > p",
        entireWebsiteHtml
      )
        .eq(i)
        .text()
        .replace(/[#_/']/g, "")
        .trim();
      let articleUrl = cheerio(
        ".post-list > .post-preview > footer > a",
        entireWebsiteHtml
      )[i].attribs.href.trim();
      let imageUrl = cheerio(
        ".post-list > .post-preview > .post-preview__image > noscript",
        entireWebsiteHtml
      )
        .eq(i)
        .text()
        .trim();
      let brand = "travelPiratesUS";
      let status = 0;

      let offertObject = {
        offertTitle: title,
        offertDescription: description,
        offertUrl: articleUrl,
        offertImageUrl: imageUrl,
        brand: brand,
        type: "Flights",
        country: "USA",
        status: status,
        confirmed_brand: 0
      };

      flyResults.push(offertObject);
    });

    //console.log(flyResults);

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
