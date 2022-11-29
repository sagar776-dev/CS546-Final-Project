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
        name = name
        //validation end
        try {
            let productList = await productData.getProductByName(name);
            res.render('name', { productList: productList });
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })

router.get('/laptops', async (req, res) => {
    try {
        let product_List = await productData.getProductsByCategory("laptops");
        console.log(product_List)
        res.render('category', { product_List: product_List })
    } catch (e) {
        res.status(404).json({ error: 'Laptops not found' });
    }
});
router.get('/laptops/:id', async (req, res) => {
    try {
        let sku = parseInt(req.params.id)
        //validation start
        sku = sku
        //validation end
        let product = await productData.getProductsByID(sku);
        // check category of sku
        //cause we can use same id for tablets and phones
        if (product.category !== "laptops") {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        // end
        res.render('productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).json({ error: 'Product not found' });
    }
});

router.get('/phones', async (req, res) => {
    try {
        let product_List = await productData.getProductsByCategory("phones");
        res.render('category', { product_List: product_List })
    } catch (e) {
        res.status(404).json({ error: 'Phones not found' });
    }
});
router.get('/phones/:id', async (req, res) => {
    try {
        let sku = parseInt(req.params.id)
        //validation start
        sku = sku
        //validation end
        let product = await productData.getProductsByID(sku);

        if (product.category !== "phones") {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.render('productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).json({ error: 'Product not found' });
    }
});

router.get('/tablets', async (req, res) => {
    try {
        let product_List = await productData.getProductsByCategory("tablets");
        res.render('category', { product_List: product_List })
    } catch (e) {
        res.status(404).json({ error: 'Tablets not found' });
    }
});
router.get('/tablets/:id', async (req, res) => {
    try {
        let sku = parseInt(req.params.id)
        //validation start
        sku = sku
        //validation end

        if (product.category !== "phones") {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        let product = await productData.getProductsByID(sku);
        res.render('productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).json({ error: 'Product not found' });
    }
});

//compareProducts
module.exports = router;
