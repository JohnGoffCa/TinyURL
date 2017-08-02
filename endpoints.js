const random = require("./random");
const bcrypt = require("bcrypt");

module.exports = function (app, database, users) {
  app.get("/", (req, res) => {
    res.end("<html>Hello!<a href=\"/urls\">urls</a></html>");
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

    if (!bcrypt.compareSync(req.body.password, currentUser.password)) {
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
      password: bcrypt.hashSync(req.body.password, 10),
    };

    res.cookie("userID", newID);
    res.redirect(303, "/urls");
  });
  
  app.get("/urls", (req, res) => {
    let templateVars = {
      user: users[req.cookies.userID],
      urls: linksBelongingTo(req.cookies.userID, database),
    };
    res.render("urls_index", templateVars);
  });

  app.post("/urls", (req, res) => {
    let newID = random();
    let httpAppended = "";
    if (req.cookies.userID) {
      if (!/^https?:\/\//.test(req.body.longURL)) {
        httpAppended = "http://" + req.body.longURL;
      } else {
        httpAppended = req.body.longURL;
      }

      database[newID] = {
        url: httpAppended,
        userID: req.cookies.userID,
      }
    }
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
      url: database[req.params.id],
      shortURL: req.params.id,
    };
    res.render("urls_show", templateVars);
  });

  app.post("/urls/:id", (req, res) => {
    if (database[req.params.id].userID === req.cookies.userID)
      database[req.params.id].url = req.body.newURL;
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
    console.log(database);
    if (!longURL) {
      res.status(404).send(`ERROR 404: No url ${req.params.shortURL} currently exists on server. Click <a href="/urls">here</a> to go to url page.`);
    }
    res.redirect(301, longURL.url);
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

function linksBelongingTo(user, database) {
  let result = {}
  for (let id in database) {
    if (database.hasOwnProperty(id)) {
      if (database[id].userID === user) {
        result[id] = database[id];
      }
    }
  }
  return result;
}
