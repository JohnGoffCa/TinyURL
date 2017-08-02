const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  "qwerty": {
    id: "qwerty",
    email: "john@goff.com",
    password: "example",
  },
  "azerty": {
    id: "azerty",
    email: "hello@world.com",
    password: "example2",
  },
}

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("./endpoints")(app, urlDatabase, users);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
