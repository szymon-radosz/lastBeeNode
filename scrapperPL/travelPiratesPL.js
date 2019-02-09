const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const url =
  "https://www.wakacyjnipiraci.pl/?utm_medium=internal&utm_source=urlaubspiraten.de&utm_campaign=nondeal_header";
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
    $("article").each(function() {
      //var href = $('a.collection-card-image', this).attr('href');

      //console.log($("header > h2", this).text());

      let title = cheerio("header > h2 ", this)
        .text()
        .replace("Pokaż ofertę:", "")
        .replace("Expired:", "")
        .replace(/[#_/']/g, "")
        .trim();

      //console.log(title);

      let description;

      if (
        cheerio("p", this)
          .text()
          .replace(/[#_/']/g, "")
          .trim() != undefined ||
        cheerio("p", this)
          .text()
          .replace(/[#_/']/g, "")
          .trim() != null
      ) {
        description = cheerio("p", this)
          .text()
          .replace(/[#_/']/g, "")
          .trim();
      } else {
        description = "-";
      }

      //console.log(description);

      let articleUrl = cheerio("header > h2 > a", this)
        .attr("href")
        .trim();

      let imageUrl = cheerio(".post-preview__image", this)
        .text()
        .trim();

      let brand = "travelPiratesPL";
      let status = 0;

      let offertObject = {
        offertTitle: title,
        offertDescription: description,
        offertUrl: articleUrl,
        offertImageUrl: imageUrl,
        brand: brand,
        type: "Flights",
        country: "PL",
        status: status,
        price: 0,
        currency: "PLN",
        confirmed_brand: 1
      };

      //console.log(offertObject);

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
