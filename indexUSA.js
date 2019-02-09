const express = require("express");
const os = require("os");
const router = express.Router();

const app = express();

//USA
require("./scrapperUS/fly4freeUS");
require("./scrapperUS/travelPiratesUS");

app.use(express.static("dist"));
