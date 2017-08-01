const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

require("./endpoints")(app, urlDatabase);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
