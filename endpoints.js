const random = require("./random");
const bcrypt = require("bcrypt");

module.exports = function (app, database, users) {
  app.get("/", (req, res) => {
    if (req.session.userID) {
      res.redirect(303, "/urls");
    } else {
      res.redirect(303, "/login");
    }
  });

  app.get("/login", (req, res) => {
    if (req.session.userID)
      res.redirect(303, "/urls");

    res.render("login");
  });
  
  app.post("/login", (req, res) => {
    let currentUser = { password: "", };

    if (emailAlreadyExists(req.body.email), users) {
      currentUser = getExistingUserFromEmail(req.body.email, users);
    } else {
      res.status(403);
      res.send("No user with that email found!");
      return;
    }

    if (!bcrypt.compareSync(req.body.password, currentUser.password)) {
      res.status(403);
      res.send("Incorrect password");
      return;
    }

    req.session.userID = currentUser.id;
    res.redirect(303, "/");
  });
  
  app.delete("/logout", (req, res) => {
    req.session = null;
    res.redirect(303, "/urls");
  });
  
  app.get("/register", (req, res) => {
    const templateVars = {
      user: users[req.session.userID],
    }

    if (req.session.userID)
      res.redirect(303, "/urls");

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

    const newID = random();
    users[newID] = {
      id: newID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };

    res.session.userID = newID;
    res.redirect(303, "/urls");
  });
  
  app.get("/urls", (req, res) => {
    const templateVars = {
      user: users[req.session.userID],
      urls: linksBelongingTo(req.session.userID, database),
    };
    res.render("urls_index", templateVars);
  });

  app.post("/urls", (req, res) => {
    const newID = random();
    let httpAppended = "";
    if (req.session.userID) {
      if (!/^https?:\/\//.test(req.body.longURL)) {
        httpAppended = "http://" + req.body.longURL;
      } else {
        httpAppended = req.body.longURL;
      }

      database[newID] = {
        url: httpAppended,
        userID: req.session.userID,
        uniqueUsers: [],
        visitorLog: [],
      }
    }
    res.redirect(303, `/urls/${newID}`);
  });

  app.get("/urls/new", (req, res) => {
    const templateVars = {
      user: users[req.session.userID],
    }

    if (req.session.userID)
      res.render("urls_new", templateVars);
    else 
      res.redirect(303, "/login");
  });

  app.get("/urls/:id", (req, res) => {
    const templateVars = {
      user: users[req.session.userID],
      url: database[req.params.id],
      shortURL: req.params.id,
    };
    res.render("urls_show", templateVars);
  });

  app.put("/urls/:id", (req, res) => {
    if (database[req.params.id].userID === req.session.userID)
      database[req.params.id].url = req.body.newURL;
    res.redirect(303, "/urls");
  });

  app.delete("/urls/:id/delete", (req, res) => {
    delete database[req.params.id];
    res.redirect(303, "/urls");
  });

  app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/u/:shortURL", (req, res) => {
    const longURL = database[req.params.shortURL];
    if (!longURL) {
      res.status(404).send(`ERROR 404: No url ${req.params.shortURL} currently exists on server. Click <a href="/urls">here</a> to go to url page.`);
    }

    if (!req.session.uniqueID) {
      req.session.uniqueID = random();
    }

    if (!longURL.uniqueUsers.includes(req.session.uniqueID)) {
      longURL.uniqueUsers.push(req.session.uniqueID);
    }
    longURL.visitorLog.push(`User ${req.session.uniqueID} visited at ${Date.getHours()}:${Date.getMinutes} on ${Date.getDate()}/${Date.getMonth() + 1}/${Date.getFullYear()}`);

    longURL.timesVisited += 1;
    res.redirect(302, longURL.url);
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
