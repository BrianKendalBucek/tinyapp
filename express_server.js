const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/////////////////////////////////////////////////////////////////////////////
////TO ENCODE
/////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/////////////////////////////////////////////////////////////////////////////
////DATABASE
/////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/////////////////////////////////////////////////////////////////////////////
////USER FUNCTION
/////////////////////////////////////////////////////////////////////////////

function generateRandomUser() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
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
    if (users[i]['email'] === emailTest) {
      return true;
    }
  }
  return false;
}

/////////////////////////////////////////////////////////////////////////////
////GET REQUESTS
/////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = {
    urls: urlDatabase,
    user 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = {
    username: req.cookies["username"],
    user
  }
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = 
  {
    username: req.cookies["username"],
    user
  };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = 
  {
    username: req.cookies["username"],
    user
  };

  res.render('urls_login', templateVars);
});

app.get("/urls/:id", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = 
    {
      username: req.cookies["username"],
      id: req.params.id, 
      longURL: urlDatabase[req.params.id],
      user 
    };

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(`https://${longURL}` );
});

/////////////////////////////////////////////////////////////////////////////
////POST REQUESTS
/////////////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if(req.body.username.length === 0) {
    res.sendStatus(400);
  }
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const emailChecker = emailDuplicate(req.body.email);
  if (emailChecker || req.body.email.length === 0 || req.body.password.length === 0) {
    res.sendStatus(400);
  }
  const templateVars = {
  };
  
  let userID = generateRandomUser();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password,
  };

  res.cookie("user_id", userID);
  // res.render("urls_register", templateVars);
  res.redirect("/urls");
});