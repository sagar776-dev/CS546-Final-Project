const { ObjectId } = require("mongodb");
const path = require("path");

const parse = require("csv-parse");
const fs = require("fs");

const usernameRegex = /^[A-Za-z0-9\s]*$/;
const charRegex = /^[A-Za-z\s]*$/;
const digitRegex = /(?=.*[0-9])/;
const capitalRegex = /^[A-Z]/;
const specialRegex = /(?=.*[!@#$%^&*.])/;
const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

const data = [];

const validateUsername = (username) => {
  if (!username) throw "Username should not be empty";
  username = username.trim().toLowerCase();
  if (username.length < 1) throw "Username should not be empty";
  if (username.length < 4) throw "Username should have atleast 4 characters";
  if (!usernameRegex.test(username))
    throw "Username should only have alphanumeric characters";
  return username;
};

const validatePassword = (password) => {
  if (!password) throw "Error: Password should not be empty";
  password = password.trim();
  if (password.length < 6) throw "Password should have atleast 6 characters";
  if (!digitRegex.test(password)) throw "Password should have atleast 1 digit";
  if (!capitalRegex.test(password))
    throw "Password should have atleast 1 capital letter";
  if (!specialRegex.test(password))
    throw "Password should have atleast 1 special character";
  return password;
};

const validateEmail = (email) => {
  if (!email) throw "Email should not be empty";
  email = email.trim();
  if (email.length === 0) throw "Email should not be empty";
  if (!email.match(emailRegex)) throw "Email is invalid";
  return email;
};

const validateGender = (gender) => {
  if (!gender) throw "Gender should not be empty";
  gender = gender.trim();
  if (gender.length === 0) throw "Gender should not be empty";
  if (
    !(
      gender.toLowerCase() === "man" ||
      gender.toLowerCase() === "woman" ||
      gender.toLowerCase() === "transgender" ||
      gender.toLowerCase() === "non-binary/non-conforming" ||
      gender.toLowerCase() === "prefer not to respond"
    )
  ) {
    throw "Gender is invalid";
  }
  return gender;
};

const validateName = (name, variableName) => {
  if (!name) throw `${variableName} should not be empty`;
  name = name.trim();
  if (name.length === 0) throw `${variableName} should not be empty`;
  if (name.length < 3) throw `${variableName} should have atleast 3 letters`;
  if (!name.match(charRegex))
    throw `${variableName} should only have alphabets`;
  return name;
};

const validateId = (id, variableName) => {
  if (!id) throw `${variableName} should not be empty`;
  id = id.trim();
  if (id.length === 0) throw `${variableName} should not be empty`;
  return id;
};

  const validateId = (id, variableName) =>{
    if(!id) throw `${variableName} should not be empty`;
    id = id.trim();
    if(id.length === 0) throw `${variableName} should not be empty`;
    return id;
  }
  
  const validateQuestion = (question, variableName) =>{
    if (!question) throw 'You must provide a question?';
    if (typeof question !== 'string') throw 'question must be a string';
    if (question.trim().length === 0)
      throw 'question cannot be an empty string or string with just spaces';
    question = question.trim();
    return question;
}

module.exports = {
  validateUsername,
  validatePassword,
  validateEmail,
  validateGender,
  validateName,
  validateId,
  validateQuestion,
};
