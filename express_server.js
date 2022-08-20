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

/////////////////////////////////////////////////////////////////////////////
////DATABASE
/////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
////GET REQUESTS
/////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = 
    {
      id: req.params.id, 
      longURL: urlDatabase[req.params.id] 
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
  console.log(req.body);
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});