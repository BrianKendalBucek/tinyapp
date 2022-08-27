const { assert } = require('chai');

const { getUserByEmail, generateRandomString, emailDuplicate, urlBelongsToUser, urlsOfUser, urlExists } = require("../helpers");

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(existingEmail, expectedOutput);
  });
});

describe('generateRandomString', funciton() {
  it('Should return a six character string', function() {
    const length = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(length, expectedOutput);
  });
  it('Should not return the same string when called more than once', function() {
    const first = generateRandomString();
    const second = generateRandomString();
    assert.notEqual(first, second);
  });
});

describe('emailDuplicate', funciton() {
  it('Should return true if email is in database', function() {
    const duplicateCheck = emailDuplicate("user2@example.com", testUsers);
    const expectedOutput = true;
    assert.equal(, expectedOutput);
  });
  it('Should return false if email is not in database', function() {
    const duplicateCheck = emailDuplicate("user9@example.com", testUsers);
    const expectedOutput = false;
    assert.equal(,);
  });
});

describe('urlBelongsToUser', funciton() {
  it('Should return true if the user created the short url and has access', function() {
    
  });
  it('Should return false if the user did not create the short url', function() {

  });
});

describe('urlExists', funciton() {
  it('Should return True if the short url in the bar is in the database', function() {

  });
  it('Should return False if the short url in the bar is not in the database', function() {

  });
});

//-------------------Generate random string
//Should return a string with six characters
//Should not return the same string when called multiple times
//-------------------
//Should return a user with a valid email
//Should return undefined when no user exists for a given email address
//-------------------
//Should return true if email corresponds to a user in the database
//Should return false if email does not correspond to a user in the database
//-------------------
//Should return an object of url information specific to the given user ID
//Should return an empty object if no urls exist for a given user ID
//-------------------
//Should return true if a cookie corresponds to a user in the database
//Should return false if a cookie does not correspond to a user in the database