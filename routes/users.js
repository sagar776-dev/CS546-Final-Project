const express = require('express');
const router = express.Router();
const data = require('../data');
// const productData = data.products;
const userData = data.users;
const validation = require('../helper/userValidation');
const path = require('path');

router
    .route('/signup')
    .get(async (req, res) => {
        res.render("users/signup");
    })
    .post(async (req, res) => {
        
    })

    router
    .route('/login')
    .get(async (req, res) => {
        res.render("users/login");
    })
    .post(async (req, res) => {

    })


    router
  .route('/userProfile/:username')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.username = validation.validateUsername(req.params.username);
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }
    try {
      const user = await userData.userProfile(req.params.username);
      if (!user)
        res.status(404).json({ error: "user doesn't exist" });
      else
        res.json(user);
    } catch (e) {
      res.status(404).json({ error: e.message, e });
    }
  })
module.exports = router;