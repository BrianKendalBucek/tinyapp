const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const { getUserByEmail, generateRandomString, emailDuplicate, urlBelongsToUser, urlsOfUser, urlExists } = require("./helpers");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.listen(PORT, () => { console.log(`Example app listening on port ${PORT}!`) });

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieSession({ name: "session", keys: ["key1"], maxAge: 24 * 60 * 60 * 1000 }));

//-----------------------DATABASE
const urlDatabase = {};
const users = {};

//===============================GET REQUESTS
app.get("/", (req, res) => { res.redirect("/urls") });
//-----------------------
app.get("/urls", (req, res) => {
  let userID = req.session["user_id"];
  const user = users[userID];
  const userURLs = urlsOfUser(userID, urlDatabase);
  const templateVars = {
    urls: userURLs,
    user,
  };
  if (userID) {
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});
//-----------------------
app.get("/urls/new", (req, res) => {
  let userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = {
    user_id: userID,
    user,
  };
  if (!userID) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});
//-----------------------
app.get("/register", (req, res) => {
  let userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = {
    user_id: req.session["user_id"],
    user,
  };
  if (userID) {
    res.redirect("/urls");
  }

  res.render("urls_register", templateVars);
});
//-----------------------
app.get("/login", (req, res) => {
  let userID = req.session["user_id"];
  if (userID) {
    return res.redirect("/urls");
  }

  const user = users[userID];
  const templateVars = { user };
  res.render("urls_login", templateVars);
});
//-----------------------
app.get("/urls/:id", (req, res) => {
  let userID = req.session["user_id"];
  const user = users[userID];
  if (!user) {
    return res.send("<h2>Must be logged in to view</h2>");
  }
  let shortURL = req.params.id;
  if (!urlBelongsToUser(shortURL, userID, urlDatabase)) {
    return res.send("<h2>You do not have access to this url</h2>");
  }
  const templateVars = {
    user_id: req.session["user_id"],
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user,
  };

  res.render("urls_show", templateVars);
});
//-----------------------
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  if (!(shortURL in urlDatabase)) {
    return res.send("<h2>URL does not exist with that id</h2>");
  }

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(`${longURL}`);
});

//===============================POST REQUESTS

app.post("/urls", (req, res) => {
  let userID = req.session["user_id"];
  if (!userID) {
    return res
      .status(401)
      .send("<h2>You cannot use this feature until you're logged in</h2>");
  }

  const { longURL } = req.body;
  if (!longURL) {
    return res.status(400).send("You need to provide a longURL value");
  }

  let shortUrl = generateRandomString();

  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    userID,
  };
  res.redirect(`/urls/${shortUrl}`);
});
//-----------------------
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let userID = req.session["user_id"];
  let user = users[userID];

  if (!urlExists(shortURL, urlDatabase)) {
    // console.log("---------", shortURL);
    // console.log("**********", urlDatabase);
    return res.status(400).send("The url does not exist");
  }
  if (!user) {
    return res.status(401).send("User is not logged in");
  }
  if (!urlBelongsToUser(shortURL, userID, urlDatabase)) {
    return res.status(401).send("User does not own this url");
  }
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect(`/urls`);
});
//-----------------------
app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  let userID = req.session["user_id"];
  let user = users[userID];

  if (!urlExists(shortURL, urlDatabase)) {
    return res.status(400).send("The url does not exist");
  }
  if (!user) {
    return res.status(401).send("User is not logged in");
  }
  if (urlBelongsToUser(shortURL, userID)) {
    return res.status(401).send("User does not own this url");
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
//-----------------------
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userID = req.session["user_id"];

  if (email.length === 0) {
    return res.sendStatus(403);
  }
  for (let i in users) {
    const emailMatches = getUserByEmail(email, users);
    // const emailMatches = users[i]["email"] === email;
    const passwordMatches = bcrypt.compareSync(password, users[i]["password"]);
    if (emailMatches && passwordMatches) {
      req.session.user_id = users[i].id;
      return res.redirect("/urls");
    }
  }
  return res.sendStatus(400);
});
//-----------------------
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
//-----------------------
app.post("/register", (req, res) => {
  const emailChecker = emailDuplicate(req.body.email, users);
  if (
    emailChecker ||
    req.body.email.length === 0 ||
    req.body.password.length === 0
  ) {
    res.sendStatus(400);
  }
  let userID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: hashedPassword,
  };

  req.session.user_id = userID;
  res.redirect("/urls");
});