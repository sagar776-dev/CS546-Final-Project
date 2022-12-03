const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
// const validation = require('../helpers');
const path = require('path');

router
    .route('/')
    .get(async (req, res) => {

    })
    .post(async (req, res) => {

    })

module.exports = router;