const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "qwerty",
    timesVisited: 0,
    uniqueUsers: [],
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "azerty",
    timesVisited: 0,
    uniqueUsers: [],
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
};

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

//change the HTML method with method-override if request contains _method
app.use(methodOverride('_method'));

//encrypt our cookies with cookie-session
app.use(cookieSession({
  name: 'session',
  secret: 'johngoff',
}));

//set static directory to /public, allows us to serve css
app.use(express.static(path.join(__dirname, "public")));

//endpoints are all defined here, in endpoints.js
require("./endpoints")(app, urlDatabase, users);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
