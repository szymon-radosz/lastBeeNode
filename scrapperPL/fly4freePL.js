const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const url = "https://www.fly4free.pl/";
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
    $(".item").each(function() {
      //var href = $('a.collection-card-image', this).attr('href');

      //console.log($("header > h2", this).text());

      let title = cheerio(".item__content > .item__title", this).text();

      //console.log(title);

      let description = "-";

      //console.log(description);

      let articleUrl = cheerio(".item__content > .item__title > a", this)
        .attr("href")
        .trim();

      //console.log(articleUrl);

      let imageUrl;
      let imageArray;

      if (
        cheerio(".item__thumb > img", this).attr("data-srcset") != undefined ||
        cheerio(".item__thumb > img", this).attr("data-srcset") != null
      ) {
        //split all results by ','
        imageArray = cheerio(".item__thumb > img", this)
          .attr("data-srcset")
          .split(/[\s,]+/);

        //if element contains something like 500x that is 500px resolution
        imageArray.map(item => {
          if (item.includes("500x")) {
            imageUrl = item;
          }
        });
      } else {
        imageUrl = "-";
      }

      console.log(imageUrl);

      let brand = "fly4freePL";
      let status = 0;

      let offertObject = {
        offertTitle: title,
        offertDescription: description,
        offertUrl: articleUrl,
        offertImageUrl: `<img src="${imageUrl}" alt="fly4freePL"/>`,
        brand: brand,
        type: "Flights",
        country: "PL",
        status: status,
        price: 0,
        currency: "PLN",
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
