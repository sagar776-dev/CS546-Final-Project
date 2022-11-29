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
            let manufactortList = await productData.getManufacturersOfProducts();
            let categoryList = await productData.getCategoryOfProducts();
            res.render('listOfProducts', { productList: productList, manufactortList: manufactortList, categoryList: categoryList })
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
    .post(async (req, res) => {
        let name = req.body.ProductName;
        //validation start
        //validation end
        try {
            let productList = await productData.getProductByName(name);
            res.render('name', { productList: productList });
        } catch (e) {
            return res.status(404).json({ error: e });
        }
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

//compareProducts
module.exports = router;
