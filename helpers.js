const getUserByEmail = (users, email) => {

  if (users[userID]["email"] === email) {
    return true;
  }
  return false;
};
//-----------------------
const generateRandomString = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
//-----------------------
const emailDuplicate = (emailTest, users) => {
  for (let i in users) {
    if (users[i]["email"] === emailTest) {
      return true;
    }
  }
  return false;
};
//-----------------------
const urlsOfUser = (user_id, urlDatabase) => {
  let userURLs = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url]["userID"] === user_id) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};
//-----------------------
const urlBelongsToUser = (shortURL, userID, urlDatabase) => {
  let userURLs = urlsOfUser(userID, urlDatabase);

  for (let url in userURLs) {
    if (url === shortURL) {
      return true;
    }
  }
  return false;
};
//-----------------------
const urlExists = (shortURL, urlDatabase) => {
  for (url in urlDatabase) {
    if (url === shortURL) {
      return true;
    }
  }
  return false;
};
//-----------------------
module.exports = {
  getUserByEmail,
  generateRandomString,
  emailDuplicate,
  urlBelongsToUser,
  urlsOfUser,
  urlExists
};
