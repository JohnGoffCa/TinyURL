let random = require("./random");

module.exports = function (app, database, users) {
  app.get("/", (req, res) => {
    res.end("Hello!");
  });

  app.post("/login", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect(303, "/urls");
  });
  
  app.post("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect(303, "/urls");
  });
  
  app.get("/register", (req, res) => {
    let templateVars = {
      username: req.cookies.username,
    }
    res.render("registration", templateVars);
  });
  
  app.post("/register", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect(303, "/urls");
  });
  
  app.get("/urls", (req, res) => {
    let templateVars = {
      username: req.cookies.username,
      urls: database,
    };
    res.render("urls_index", templateVars);
  });

  app.post("/urls", (req, res) => {
    let newID = random();
    database[newID] = req.body.longURL;
    res.redirect(303, `/urls/${newID}`);
  });

  app.get("/urls/new", (req, res) => {
    let templateVars = {
      username: req.cookies.username,
    }
    res.render("urls_new", templateVars);
  });

  app.get("/urls/:id", (req, res) => {
    let templateVars = {
      username: req.cookies.username,
      shortURL: req.params.id,
      fullURL: database[req.params.id],
    };
    res.render("urls_show", templateVars);
  });

  app.post("/urls/:id", (req, res) => {
    database[req.params.id] = req.body.newURL;
    res.redirect(303, "/urls");
  });

  app.post("/urls/:id/delete", (req, res) => {
    delete database[req.params.id];
    res.redirect(303, "/urls");
  });

  app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/u/:shortURL", (req, res) => {
    let longURL = database[req.params.shortURL];
    if (!longURL) {
      res.status(404).send(`ERROR 404: No url ${req.params.shortURL} currently exists on server. Click <a href="/urls">here</a> to go to url page.`);
    }
    res.redirect(301, longURL);
  });

  app.get("/hello", (req, res) => {
    res.end("<html><body>Hello <b>World</b></body></html>\n");
  });
}
