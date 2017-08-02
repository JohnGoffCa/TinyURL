const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "qwerty",
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "azerty",
  },
};

const users = {
  "qwerty": {
    id: "qwerty",
    email: "john@goff.com",
    password: bcrypt.hashSync("example", 10),
  },
  "azerty": {
    id: "azerty",
    email: "hello@world.com",
    password: bcrypt.hashSync("example2", 10),
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
