const express = require("express");
const os = require("os");
const router = express.Router();

const app = express();

//UK
require("./scrapperUK/fly4freeUK");
require("./scrapperUK/travelPiratesUK");

app.use(express.static("dist"));
