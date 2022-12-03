const mongoCollection = require("../config/mongoCollections");
const bcrypt = require("bcrypt");
const config = require("../config/settings.json");

const userValidate = require('../helper/userValidation');

const registerUser = async (user) => {
  //Validate all fields to checck for valid inputs  
  username = userValidate.validateUsername(user.username);
  firstName = userValidate.validateName(user.firstName, "First name");
  lastName = userValidate.validateName(user.lastName, "Last name");
  gender = userValidate.validateGender(user.gender);
  email = userValidate.validateEmail(user.email);
  password = userValidate.validatePassword(user.password);
  userType = userValidate.validateUsertype(user.usertype);

  let usersCollection = await mongoCollection.users();
  let tempUser = await usersCollection.findOne({ username: username });
  if (tempUser) throw "Error: User already exists";

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  user = {
    username: username,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    userType: userType,
    wishlists: [],
    history: []
  };
  let insertInfo = await usersCollection.insertOne(user);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not create the user account";
  return { insertedUser: true };
};

const checkUser = async (username, password) => {
  username = validateUsername(username);
  password = validatePassword(password);

  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  if (!user) throw "Error: Either the username or password is invalid";

  let compareToHash = false;
  compareToHash = await bcrypt.compare(password, user.password);

  if(compareToHash){
    return {authenticatedUser: true};
  } else{
    throw "Error: Either the username or password is invalid";
  }
};



module.exports = {
  registerUser,
  checkUser
};
