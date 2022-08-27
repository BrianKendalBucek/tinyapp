//If user in database via emailsearch, gets userID
const getUserByEmail = (users, email) => {

  if (users[userID]["email"] === email) {
    return true;
  }
  return false;
};
//-----------------------
//Creates 6 character string for shortURL and user id
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
//Checks if email input is already in database
const emailDuplicate = (users, email) => {
  for (let i in users) {
    if (users[i]["email"] === email) {
      return true;
    }
  }
  return false;
};
//-----------------------
//Compares user id from cookie to user id in user database
//If true, the url from each matching id obj is passed into the userURLs {}
const urlsOfUser = (userID, urlDatabase) => {
  let userURLs = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url]["userID"] === userID) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};
//Compares the shortURL from the bar to the short URL in the object userURLs
//If they don't match, the non verified user can't access it
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
//To confirm if the short URL from the bar matches the database short URL
const urlExists = (shortURL, urlDatabase) => {
  for (let url in urlDatabase) {
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
