const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlBelongsToUser, urlsOfUser, urlExists } = require("../helpers");
//-----------------------
const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
//-----------------------
describe('getUserByEmail', function() {
  it('Should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    assert.equal(user, testUsers["userRandomID"]);
  });
  it('Should return undefined if passed in user not in database', function() {
    const user = getUserByEmail("nonuser@example.com", testUsers)
    assert.equal(user, false);
  })
});
//-----------------------
describe('generateRandomString', function() {
  it('Should return a six character string', function() {
    const length = generateRandomString().length;
    assert.equal(length, 6);
  });
  it('Should not return the same string when called more than once', function() {
    const first = generateRandomString();
    const second = generateRandomString();
    assert.notEqual(first, second);
  });
});
//-----------------------
describe('urlBelongsToUser', function() {
  it('Should return true if the user created the short url and has access', function() {
    const urlBelongs = urlBelongsToUser("b6UTxQ", "aJ48lW", testUrlDatabase);
    assert.equal(urlBelongs, true);
  });
  it('Should return false if the user did not create the short url', function() {
    const urlBelongs = urlBelongsToUser("a1b2c3", "aJ48lW", testUrlDatabase);
    assert.equal(urlBelongs, false);
  });
});
//-----------------------
describe('urlExists', function() {
  it('Should return true if the short url in the bar is in the database', function() {
    const exists = urlExists("b6UTxQ", testUrlDatabase);
    assert.equal(exists, true);
  });
  it('Should return false if the short url in the bar is not in the database', function() {
    const exists = urlExists("3a1b2c", testUrlDatabase);
    assert.equal(exists, false);
  });
});