const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
// const validation = require('../helpers');
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

module.exports = router;