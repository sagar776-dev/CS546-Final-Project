const express = require("express");
const router = express.Router();
const data = require("../data");
const path = require("path");

const userValidate = require("../helper/userValidation");
const userData = data.users;

router
  .route("/signup")
  .get(async (req, res) => {
    res.render("users/signup");
  })
  .post(async (req, res) => {
    try {
      console.log("Signup route");
      let user = req.body;
      username = userValidate.validateUsername(user.username);
      firstName = userValidate.validateName(user.firstName, "First name");
      lastName = userValidate.validateName(user.lastName, "Last name");
      gender = userValidate.validateGender(user.gender);
      email = userValidate.validateEmail(user.email);
      password = userValidate.validatePassword(user.password);
      userData.registerUser(user);
      res.statusCode(200).json({ message: "User registered" });
    } catch (e) {
      console.log(e);
      res.statusCode(500).json({ error: e });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    res.render("users/login");
  })
  .post(async (req, res) => {
    console.log("Signin route");
    try {
      let user = req.body;
      // if(user.userid.includes('@')){

      // }
      let result = await userData.checkUser(user.userid, user.password);
      res.json({ message: "Logged in" });
    } catch (e) {
      console.log(e);
      res.json({ error: e });
    }
  });

module.exports = router;
