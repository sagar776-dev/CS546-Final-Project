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
            res.render('listOfProducts', { productList: productList })
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
    .post(async (req, res) => {

    })

router.get('/:id', async (req, res) => {
    try {
        let sku = parseInt(req.params.id)
        let product = await productData.getProductsByID(sku);
        res.render('productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).json({ error: 'Product not found' });
    }
});
module.exports = router;
