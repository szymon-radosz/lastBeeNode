const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const url = "https://www.travelpirates.com/flights";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

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
        price: 0,
        currency: "USD",
        confirmed_brand: 1
      };

      flyResults.push(offertObject);
    });

    //console.log(flyResults);

    flyResults.map(singleFlyResult => {
      const options = {
        method: "POST",
        uri: `${process.env.API_URL}api/storeOffer`,
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
          price: singleFlyResult.price,
          currency: singleFlyResult.currency,
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
