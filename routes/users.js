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
      user.username = userValidate.validateUsername(user.username);
      user.firstName = userValidate.validateName(user.firstName, "First name");
      user.lastName = userValidate.validateName(user.lastName, "Last name");
      user.gender = userValidate.validateGender(user.gender);
      user.email = userValidate.validateEmail(user.email);
      user.password = userValidate.validatePassword(user.password);
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
      user.username = userValidate.validateUsername(user.username);
      user.firstName = userValidate.validateName(user.firstName, "First name");
      await userData.checkUser(user.username, user.password);
      req.session.username = user.username;
      //res.json({ message: "Logged in" });
      res.redirect("/api/products");
    } catch (e) {
      console.log(e);
      res.json({ error: e });
    }
  });

module.exports = router;
