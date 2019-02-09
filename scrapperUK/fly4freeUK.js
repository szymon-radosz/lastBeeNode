const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const url = "https://www.fly4free.com/flight-deals/uk/";
const request = require("request");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

request(
  {
    method: "GET",
    url: url
  },
  function(err, response, body) {
    if (err) return console.error(err);

    const flyResults = [];

    // Tell Cherrio to load the HTML
    $ = cheerio.load(body);
    $(".entry").each(function() {
      //var href = $('a.collection-card-image', this).attr('href');

      //console.log($("header > h2", this).text());

      let title = cheerio(".entry__title", this).text();

      //console.log(title);

      let description = cheerio(".entry__content > p", this)
        .text()
        .replace(/[#_/']/g, "")
        .replace("More", "")
        .trim();

      //console.log(description);

      let articleUrl = cheerio(".entry__title > a", this)
        .attr("href")
        .trim();

      //console.log(articleUrl);

      let imageUrl;

      if (
        cheerio(".media-photo > a > img", this).attr("src") != undefined ||
        cheerio(".media-photo > a > img", this).attr("src") != null
      ) {
        imageUrl =
          "https:" + cheerio(".media-photo > a > img", this).attr("src");
      } else {
        imageUrl = "-";
      }

      /*", entireWebsiteHtml)[i]
      .attribs.src;
*/
      console.log(imageUrl);

      let brand = "fly4freeUK";
      let status = 0;

      let offertObject = {
        offertTitle: title,
        offertDescription: description,
        offertUrl: articleUrl,
        offertImageUrl: `<img src="${imageUrl}" alt="fly4freeUK"/>`,
        brand: brand,
        type: "Flights",
        country: "UK",
        status: status,
        price: 0,
        currency: "GBP",
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

      console.log(singleFlyResult);

      requestPromise(options)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    //console.log(flyResults[0]);
  }
);
