let random = require("./random");

module.exports = function (app, database, users) {
  app.get("/", (req, res) => {
    res.end("Hello!");
  });

  app.get("/login", (req, res) => {
    let templateVars = {
    }
    res.render("login", templateVars);
  });
  
  app.post("/login", (req, res) => {
    let currentUser;

    if (emailAlreadyExists(req.body.email), users) {
      currentUser = getExistingUserFromEmail(req.body.email, users);
    } else {
      res.status(403);
      res.send("No user with that email found!");
    }

    if (currentUser.password !== req.body.password) {
      res.status(403);
      res.send("Incorrect password");
    }

    res.cookie("userID", currentUser.id);
    res.redirect(303, "/");
  });
  
  app.post("/logout", (req, res) => {
    res.clearCookie("userID");
    res.redirect(303, "/urls");
  });
  
  app.get("/register", (req, res) => {
    let templateVars = {
      user: users[req.cookies.userID],
    }

    res.render("registration", templateVars);
  });
  
  app.post("/register", (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.status(400);
      res.send("Error 400: no username or password provided");
    } else if (emailAlreadyExists(req.body.email, users)) {
      res.status(400);
      res.send("Error 400: email already exists");
    }

    let newID = random();
    users[newID] = {
      id: newID,
      email: req.body.email,
      password: req.body.password,
    };

    res.cookie("userID", newID);
    res.redirect(303, "/urls");
  });
  
  app.get("/urls", (req, res) => {
    let templateVars = {
      user: users[req.cookies.userID],
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
      user: users[req.cookies.userID],
    }
    if (req.cookies.userID)
      res.render("urls_new", templateVars);
    else 
      res.redirect(303, "/login");
  });

  app.get("/urls/:id", (req, res) => {
    let templateVars = {
      user: users[req.cookies.userID],
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

function emailAlreadyExists(email, users) {
  //console.log(email, users)
  for (let id in users) {
    if (users.hasOwnProperty(id)) {
      if (users[id].email === email)
        return true;
    }
  }
  return false;
}

function getExistingUserFromEmail(email, users) {
  for (let id in users) {
    if (users.hasOwnProperty(id)) {
      if (users[id].email === email)
        return users[id];
    }
  }
}
