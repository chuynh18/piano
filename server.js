"use strict";

// ========================= EXPRESS.js dependencies ==========================

var express = require("express");

// ============================= EXPRESS.js setup =============================

var app = express();
var PORT = process.env.PORT || 8080; // so that I can deploy to Heroku or test locally on port 8080

app.use(express.static("public"));

// ============================= EXPRESS.js LISTEN =============================

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});