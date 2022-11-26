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
const peopleData = data.people;
// const validation = require('../helpers');
const path = require('path');