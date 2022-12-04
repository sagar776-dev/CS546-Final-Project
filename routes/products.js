const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
// const validation = require('../helpers');
const path = require('path');

router
    .route('/')
    .get(async (req, res) => {
        const page = parseInt(req.query.page)
        let search = req.query.search

        let error;
        try {
            let productList = 0;
            if (!search) {
                productList = await productData.getAllProducts();
            } else {
                productList = await productData.getProductByName(search);
                if (productList.length === 0) {
                    productList = await productData.getAllProducts();
                    error = `Product with a name of "${search}" Not Found`
                }
            }
            let categoryList = await productData.getCategoryOfProducts();
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            if (current < 1) {
                current = 1
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            else {
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            if (pageNext > 1 + parseInt(productList.length / 10)) {
                pageNext = NaN
            }
            resultsProducts.page = {
                "search": search,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end

            res.render('products/listOfProducts', { productList: resultsProducts, categoryList: categoryList, error: error })

        } catch (e) {
            return res.status(404).json('products/listOfProducts', { error: e });
        }
    })
//laptops
router
    .route('/laptops')
    .get(async (req, res) => {
        let manufacturer = req.query.manufacturer
        const page = parseInt(req.query.page)
        try {
            let productList = 0;
            if (!manufacturer) {
                productList = await productData.getProductsByCategory("laptops");
            } else {
                productList = await productData.getProductsByCategoryAndManufacturer("laptops", manufacturer);
            }
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("laptops");
            //pagination start
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            if (current < 1) {
                current = 1
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            else {
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            if (pageNext > 1 + parseInt(productList.length / 10)) {
                pageNext = NaN
            }
            resultsProducts.page = {
                "manufacturer": manufacturer,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end
            res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List })
        } catch (e) {
            return res.status(404).render('products/listOfProducts', { error: 'Laptops not found' });
        }
    })
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
            return res.status(404).render('products/productPage', { error: 'Product not found' });
        }
        // end
        res.render('products/productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        return res.status(404).render('products/error', { error: 'Product not found' });
    }
});
//phones
router
    .route('/phones')
    .get(async (req, res) => {
        let manufacturer = req.query.manufacturer
        const page = parseInt(req.query.page)
        try {
            let productList = 0;
            if (!manufacturer) {
                productList = await productData.getProductsByCategory("phones");
            } else {
                productList = await productData.getProductsByCategoryAndManufacturer("phones", manufacturer);
            }
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("phones");
            //pagination start
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            if (current < 1) {
                current = 1
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            else {
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            if (pageNext > 1 + parseInt(productList.length / 10)) {
                pageNext = NaN
            }
            resultsProducts.page = {
                "manufacturer": manufacturer,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end
            res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List })
        } catch (e) {
            return res.status(404).render('products/listOfProducts', { error: 'Phones not found' });
        }
    })
router.get('/phones/:id', async (req, res) => {
    try {
        let sku = parseInt(req.params.id)
        //validation start
        sku = sku
        //validation end
        let product = await productData.getProductsByID(sku);
        if (product.category !== "phones") {
            return res.status(404).render('products/productPage', { error: 'Product not found' });
        }
        res.render('products/productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        return res.status(404).render('products/error', { error: 'Product not found' });
    }
});
//tablets
router
    .route('/tablets')
    .get(async (req, res) => {
        let manufacturer = req.query.manufacturer
        const page = parseInt(req.query.page)
        try {
            let productList = 0;
            if (!manufacturer) {
                productList = await productData.getProductsByCategory("tablets");
            } else {
                productList = await productData.getProductsByCategoryAndManufacturer("tablets", manufacturer);
            }
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("tablets");
            //pagination start
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            if (current < 1) {
                current = 1
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            else {
                pageNext = (current + 1)
                pagePrevious = (current - 1)
            }
            if (pageNext > 1 + parseInt(productList.length / 10)) {
                pageNext = NaN
            }

            resultsProducts.page = {
                "manufacturer": manufacturer,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }

            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end
            res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List })
        } catch (e) {
            return res.status(404).render({ error: 'Tablets not found' });
        }
    })
router.get('/tablets/:id', async (req, res) => {
    try {
        let sku = parseInt(req.params.id)
        //validation start
        sku = sku
        //validation end
        let product = await productData.getProductsByID(sku);

        if (product.category !== "tablets") {
            res.status(404).render('products/productPage', { error: 'Product not found' });
            return;
        }
        res.render('products/productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).render('products/error', { error: 'Product not found' });
    }
});

router.get('/compare', async (req, res) => {

})
//compareProducts not finished
module.exports = router;
