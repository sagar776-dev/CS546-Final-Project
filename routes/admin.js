// getAllProducts()
// print all products 

// addProductByAxios(...)-by BestBuy API
// using APi key to get products 

// addProduct(...)
// add product manually 

// getProductsByID(id)
// get specific product

// updateProduct(id,...)
// update existence product

// removeProduct(id)
// remove product 

// getProductsByAxios(api_key)
// API_key uses

const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
// const validation = require('../helpers');
const path = require('path');

router
    .route('/')
    .get(async (req, res) => {
        try {
            let productList = await productData.getAllProducts();
            res.json(productList);
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
    .post(async (req, res) => {

    })
module.exports = router;
