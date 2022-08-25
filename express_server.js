const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

/////////////////////////////////////////////////////////////////////////////
////DATABASE
/////////////////////////////////////////////////////////////////////////////

// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
// };

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// urlDatabase[id][longURL];

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/////////////////////////////////////////////////////////////////////////////
////SHORT STRING FUNCTION
/////////////////////////////////////////////////////////////////////////////

function generateRandomString() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/////////////////////////////////////////////////////////////////////////////
////Duplicate Email Checker
/////////////////////////////////////////////////////////////////////////////

const emailDuplicate = (emailTest) => {
  for (let i in users) {
    if (users[i]["email"] === emailTest) {
      return true;
    }
  }
  return false;
};

/////////////////////////////////////////////////////////////////////////////
////Returns the URLs where the userID is equal to the ide of current logged in user
/////////////////////////////////////////////////////////////////////////////

const urlsForUser = (user_id) => {
  // let userID = req.cookies["user_ids"];
  let userURLs = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url]["userID"] === user_id) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};

/////////////////////////////////////////////////////////////////////////////
////Check if the url belongs to the user
/////////////////////////////////////////////////////////////////////////////

const urlBelongsToUser = (shortURL, user_id) => {
  let userURLs = urlsForUser(user_id);
  for (let url in userURLs) {
    if (url === shortURL) {
      return true;
    }
  }
  return false;
};

/////////////////////////////////////////////////////////////////////////////
////GET REQUESTS
/////////////////////////////////////////////////////////////////////////////

const urlExists = (shortURL) => {
  for (url in urlDatabase) {
    if (url === shortURL) {
      return true;
    }
  }
  return false;
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
///////////////////////////////////////
app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const userURLs = urlsForUser(userID);
  const templateVars = {
    urls: userURLs,
    user,
  };
  res.render("urls_index", templateVars);
});
///////////////////////////////////////
app.get("/urls/new", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = {
    user_id: req.cookies["user_id"],
    user,
  };
  if (!userID) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});
///////////////////////////////////////
app.get("/register", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = {
    user_id: req.cookies["user_id"],
    user,
  };
  if (userID) {
    res.redirect("/urls");
  }

  res.render("urls_register", templateVars);
});
///////////////////////////////////////
app.get("/login", (req, res) => {
  let userID = req.cookies["user_id"];
  if (userID) {
    return res.redirect("/urls");
  }

  const user = users[userID];
  const templateVars = { user };
  res.render("urls_login", templateVars);
});
///////////////////////////////////////
app.get("/urls/:id", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  if (!user) {
    return res.send("<h2>Must be logged in to view</h2>");
  }
  let shortURL = req.params.id;
  if (!urlBelongsToUser(shortURL, userID)) {
    return res.send("<h2>You do not have access to this url</h2>");
  }
  const templateVars = {
    user_id: req.cookies["user_id"],
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user,
  };

  res.render("urls_show", templateVars);
});
///////////////////////////////////////
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  if (!(shortURL in urlDatabase)) {
    return res.send("<h2>URL does not exist with that id</h2>");
  }

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(`${longURL}`);
});

/////////////////////////////////////////////////////////////////////////////
////POST REQUESTS
/////////////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
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
///////////////////////////////////////
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let userID = req.cookies["user_id"];
  let user = users[userID];

  if (!urlExists(shortURL)) {
    return res.status(404).send("The url does not exist");
  }
  if (!user) {
    return res.status(404).send("User is not logged in");
  }
  if (urlBelongsToUser(shortURL, userID)) {
    return res.status(404).send("User does not own this url");
  }
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect(`/urls`);
});
///////////////////////////////////////
app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  let userID = req.cookies["user_id"];
  let user = users[userID];

  if (!urlExists(shortURL)) {
    return res.status(404).send("The url does not exist");
  }
  if (!user) {
    return res.status(404).send("User is not logged in");
  }
  if (urlBelongsToUser(shortURL, userID)) {
    return res.status(404).send("User does not own this url");
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
///////////////////////////////////////
app.post("/login", (req, res) => {
  if (req.body.email.length === 0) {
    return res.sendStatus(403);
  }
  for (let i in users) {
    const emailMatches = users[i]["email"] === req.body.email;
    const passwordMatches = bcrypt.compareSync(req.body.password, users[i]["password"]);
    if (emailMatches && passwordMatches) {
      res.cookie("user_id", users[i].id);
      return res.redirect("/urls");
    }
  }
  return res.sendStatus(400);

});
///////////////////////////////////////
app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.body.user_id);
  res.redirect("/urls");
});
///////////////////////////////////////
app.post("/register", (req, res) => {
  const emailChecker = emailDuplicate(req.body.email);
  if (
    emailChecker ||
    req.body.email.length === 0 ||
    req.body.password.length === 0
  ) {
    res.sendStatus(403);
  }
  let userID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: hashedPassword
  };

  res.cookie("user_id", userID);
  res.redirect("/urls");
});
