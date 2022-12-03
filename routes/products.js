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
            let categoryList = await productData.getCategoryOfProducts();
            //pagination start
            const page = parseInt(req.query.page)
            //const limit = req.query.limit
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end

            res.render('products/listOfProducts', { productList: resultsProducts, categoryList: categoryList })

        } catch (e) {
            return res.status(404).json('products/listOfProducts', { error: e });
        }
    })
    .post(async (req, res) => {
        let name = req.body.ProductName;
        //validation start
        name = name
        //validation end
        try {
            let productList = await productData.getProductByName(name);

            //pagination start
            const page = parseInt(req.query.page)
            //const limit = req.query.limit
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end

            res.render('products/name', { productList: productList });
        } catch (e) {
            return res.status(404).render('products/name', { error: e });
        }
    })

//laptops
router
    .route('/laptops')
    .get(async (req, res) => {
        try {
            // if () {
            let product_List = await productData.getProductsByCategory("laptops");
            // } else {
            //     let product_List = await productData.getProductsByCategoryAndManufacturer("laptops", manufacturer);
            // }
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("laptops");
            //pagination start
            const page = parseInt(req.query.page)
            //const limit = req.query.limit
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = product_List.slice(startIndex, endIndex)
            //pagination end
            res.render('products/category', { product_List: resultsProducts, manufactort_List: manufactort_List })
        } catch (e) {
            return res.status(404).render('products/category', { error: 'Laptops not found' });
        }
    })
    .post(async (req, res) => {
        let manufacturer = req.body.ManufacturerOfCategoryName;
        //validation start
        manufacturer = manufacturer
        const page = parseInt(req.query.page)
        //validation end
        try {
            let product_List = await productData.getProductsByCategoryAndManufacturer("laptops", manufacturer);
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("laptops");
            //pagination start
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = product_List.slice(startIndex, endIndex)
            //pagination end
            res.render('products/category', { product_List: resultsProducts, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).render('products/category', { errors: e });
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
        try {
            let product_List = await productData.getProductsByCategory("phones");
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("phones");
            //pagination start
            const page = parseInt(req.query.page)
            //const limit = req.query.limit
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = product_List.slice(startIndex, endIndex)
            //pagination end
            res.render('products/category', { product_List: resultsProducts, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).render('products/category', { error: 'Phones not found' });
        }
    })
    .post(async (req, res) => {
        let manufacturer = req.body.ManufacturerOfCategoryName;
        //validation start
        manufacturer = manufacturer
        //validation end
        try {
            let product_List = await productData.getProductsByCategoryAndManufacturer("phones", manufacturer);
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("phones");
            //pagination start
            const page = parseInt(req.query.page)
            //const limit = req.query.limit
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = product_List.slice(startIndex, endIndex)
            //pagination end
            res.render('products/category', { product_List: resultsProducts, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).render('products/category', { error: e });
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
        try {
            let product_List = await productData.getProductsByCategory("tablets");
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("tablets");
            //pagination start
            const page = parseInt(req.query.page)
            //const limit = req.query.limit
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = product_List.slice(startIndex, endIndex)
            //pagination end
            res.render('products/category', { product_List: resultsProducts, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).render({ error: 'Tablets not found' });
        }
    })
    .post(async (req, res) => {
        let manufacturer = req.body.ManufacturerOfCategoryName;
        //validation start
        manufacturer = manufacturer
        //validation end
        try {
            let product_List = await productData.getProductsByCategoryAndManufacturer("tablets", manufacturer);
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("tablets");
            //pagination start
            const page = parseInt(req.query.page)
            //const limit = req.query.limit
            //const page = 1
            const limit = 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const resultsProducts = {}
            //fix later
            current = page
            pageNext = (page + 1)
            pagePrevious = (page - 1)
            resultsProducts.page = {
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit
            }
            resultsProducts.results = product_List.slice(startIndex, endIndex)
            //pagination end
            res.render('products/category', { product_List: resultsProducts, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).render('products/category', { errors: e });
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
