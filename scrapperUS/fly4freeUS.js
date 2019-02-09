const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const url = "https://www.fly4free.com/flights/flight-deals/usa/";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

requestPromise(url)
  .then(function(entireWebsiteHtml) {
    const result = cheerio(".entries-sub > .entry", entireWebsiteHtml);

    const flyResults = [];

    result.map(i => {
      let title = cheerio(
        ".entries > .entry > .entry__title",
        entireWebsiteHtml
      )
        .eq(i)
        .text();
      let description = cheerio(
        ".entries > .entry > .entry__content > p > strong",
        entireWebsiteHtml
      )
        .eq(i)
        .text();
      let articleUrl = cheerio(
        ".entries > .entry > .media-photo > a",
        entireWebsiteHtml
      )[i].attribs.href;
      let imageUrl = cheerio(
        ".entries > .entry > .media-photo > a > img",
        entireWebsiteHtml
      )[i].attribs.src;
      let brand = "fly4freeUS";
      let status = 0;

      let offertObject = {
        offertTitle: title,
        offertDescription: description,
        offertUrl: articleUrl,
        offertImageUrl: `<img src="${imageUrl}" alt="fly4freeUS"/>`,
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
