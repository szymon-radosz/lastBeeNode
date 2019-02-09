const express = require("express");
const os = require("os");
const router = express.Router();

const app = express();

//AU
require("./scrapperAU/fly4freeAU");

app.use(express.static("dist"));
