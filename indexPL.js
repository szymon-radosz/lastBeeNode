const express = require("express");
const os = require("os");
const router = express.Router();

const app = express();

//PL
require("./scrapperPL/fly4freePL");
require("./scrapperPL/travelPiratesPL");

app.use(express.static("dist"));
