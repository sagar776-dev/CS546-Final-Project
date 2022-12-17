const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
const qnaData = data.qna;
// const validation = require('../helpers');


//Test API

// router.get('/test/:id', async (req, res) => {
// try{
//     let sku = parseInt(req.params.id)
//     let qna = await qnaData.getQna(sku);
//     console.log(qna);
// } catch (e) {
//     return res.status(404).render('products/error', { error: 'Product not found' });
// }
// });


    router
        .route('/')
        .get(async (req, res) => {
            let url_query = req.query
            //move to validation - object to lowercase
            let key, keys = Object.keys(url_query);
            let n = keys.length;
            let newobj = {}
            while (n--) {
                key = keys[n];
                newobj[key.toLowerCase()] = url_query[key];
            }
            //
            //validation start
            let page = parseInt(newobj.page)
            if (!page) {
                page = 1;
            }
            let search = newobj.search
            //validation end
            let error = [];
            try {
                let productList = 0;
                if (!search) {
                    productList = await productData.getAllProducts();
                } else {
                    productList = await productData.getProductByName(search);
                    if (productList.length === 0) {
                        productList = await productData.getAllProducts();
                        error.push(`Product with a name of "${search}" Not Found`)
                    }
                }
                let categoryList = await productData.getCategoryOfProducts();
                //const page = 1
                current = page
                if (current < 1) {
                    current = 1
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the first page of products.`)
                }
                if (current > parseInt(productList.length / 10) + 1) {
                    current = parseInt(productList.length / 10)
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the last page of products.`)
                }
                else {
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                }
                if (pageNext > parseInt(productList.length / 10)) {
                    pageNext = NaN
                }
                const limit = 10
                const startIndex = (current - 1) * limit
                const endIndex = current * limit
                const resultsProducts = {}

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
    // .post(async (req, res) => {
    //     //need a jquary 
    //     let name = req.body.ProductName;
    //     //validation start
    //     name = name
    //     //validation end
    //     try {
    //         let productList = {}
    //         productList.results = await productData.getProductByName(name);
    //         res.render('products/listOfProducts', { productList: productList });
    //     } catch (e) {
    //         return res.status(404).render('products/listOfProducts', { error: e });
    //     }
    // })
    //laptops
    router
        .route('/laptops')
        .get(async (req, res) => {
            //move to validation - object to lowercase
            let url_query = req.query
            let key, keys = Object.keys(url_query);
            let n = keys.length;
            let newobj = {}
            while (n--) {
                key = keys[n];
                newobj[key.toLowerCase()] = url_query[key];
            }
            //
            let search = newobj.search
            if (search != undefined) {
                return res.redirect(`http://localhost:3000/products?search=${search}`)
            }
            //validation start
            let page = parseInt(newobj.page)
            if (!page) {
                page = 1;
            }
            let manufacturer = newobj.manufacturer
            let error = [];
            try {
                let productList = 0;
                if (!manufacturer) {
                    productList = await productData.getProductsByCategory("laptops");
                } else {
                    productList = await productData.getProductsByCategoryAndManufacturer("laptops", manufacturer);
                }
                let manufactort_List = await productData.getManufacturersOfProductsByCategory("laptops");
                //pagination start
                //fix later
                current = page
                if (current < 1) {
                    current = 1
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the first page of products.`)
                }
                if (current > parseInt(productList.length / 10) + 1) {
                    current = parseInt(productList.length / 10) + 1
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the last page of products.`)
                }
                else {
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                }
                if (pageNext > 1 + parseInt(productList.length / 10)) {
                    pageNext = NaN
                }
                const limit = 10
                const startIndex = (current - 1) * limit
                const endIndex = current * limit
                const resultsProducts = {}
                resultsProducts.page = {
                    "manufacturer": manufacturer,
                    current: current,
                    next: pageNext,
                    previous: pagePrevious,
                    limit: limit
                }
                resultsProducts.results = productList.slice(startIndex, endIndex)
                //pagination end
                res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List, error: error })
            } catch (e) {
                return res.status(404).render('products/listOfProducts', { error: 'Laptops not found' });
            }
        })
    router.get('/laptops/:id', async (req, res) => {
        try {
            //move to validation - object to lowercase
            let url_query = req.query
            let key, keys = Object.keys(url_query);
            let n = keys.length;
            let newobj = {}
            while (n--) {
                key = keys[n];
                newobj[key.toLowerCase()] = url_query[key];
            }
            //
            let search = newobj.search
            if (search != undefined) {
                return res.redirect(`http://localhost:3000/products?search=${search}`)
            }
            //move to validation
            let sku = parseInt(req.params.id)
            //validation start
            sku = sku
            //validation end
            let product = await productData.getProductsByID(sku);
            console.log(product);
            let qna = await qnaData.getAllQna(sku);
            console.log(qna);
            //let qna =
            // check category of sku
            //cause we can use same id for tablets and phones
            if (product.category !== "laptops") {
                return res.status(404).render('products/productPage', { error: 'Product not found' });
            }
            // end
            let updatedProduct = await productData.updateProductVisitedCounter(sku);
            res.render('products/productPage', { product: updatedProduct, pictures: updatedProduct.pictures, details: updatedProduct.details, qna: qna });
        } catch (e) {
            console.log(e);
            //return res.status(404).render('products/error', { error: 'Product not found' });
        }
    });
    //phones
    router
        .route('/phones')
        .get(async (req, res) => {
            //move to validation - object to lowercase
            let url_query = req.query
            let key, keys = Object.keys(url_query);
            let n = keys.length;
            let newobj = {}
            while (n--) {
                key = keys[n];
                newobj[key.toLowerCase()] = url_query[key];
            }
            //
            let search = newobj.search
            if (search != undefined) {
                return res.redirect(`http://localhost:3000/products?search=${search}`)
            }
            //move to validation
            //validation start
            let page = parseInt(newobj.page)
            if (!page) {
                page = 1;
            }
            let manufacturer = newobj.manufacturer
            let error = [];
            try {
                let productList = 0;
                if (!manufacturer) {
                    productList = await productData.getProductsByCategory("phones");
                } else {
                    productList = await productData.getProductsByCategoryAndManufacturer("phones", manufacturer);
                }
                let manufactort_List = await productData.getManufacturersOfProductsByCategory("phones");
                //pagination start
                //fix later
                current = page
                if (current < 1) {
                    current = 1
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the first page of products.`)
                }
                if (current > parseInt(productList.length / 10) + 1) {
                    current = parseInt(productList.length / 10) + 1
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the last page of products.`)
                }
                else {
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                }
                if (pageNext > 1 + parseInt(productList.length / 10)) {
                    pageNext = NaN
                }
                const limit = 10
                const startIndex = (current - 1) * limit
                const endIndex = current * limit
                const resultsProducts = {}
                resultsProducts.page = {
                    "manufacturer": manufacturer,
                    current: current,
                    next: pageNext,
                    previous: pagePrevious,
                    limit: limit
                }
                resultsProducts.results = productList.slice(startIndex, endIndex)
                //pagination end
                res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List, error: error })
            } catch (e) {
                return res.status(404).render('products/listOfProducts', { error: 'Phones not found' });
            }
        })
    router.get('/phones/:id', async (req, res) => {
        try {
            //move to validation - object to lowercase
            let url_query = req.query
            let key, keys = Object.keys(url_query);
            let n = keys.length;
            let newobj = {}
            while (n--) {
                key = keys[n];
                newobj[key.toLowerCase()] = url_query[key];
            }
            //
            let search = newobj.search
            if (search != undefined) {
                return res.redirect(`http://localhost:3000/products?search=${search}`)
            }
            //move to validation
            let sku = parseInt(req.params.id)
            //validation start
            sku = sku
            //validation end
            let product = await productData.getProductsByID(sku);
            let qna = await qnaData.getQna(sku);
            if (product.category !== "phones") {
                return res.status(404).render('products/productPage', { error: 'Product not found' });
            }
            let updatedProduct = await productData.updateProductVisitedCounter(sku);
            res.render('products/productPage', { product: updatedProduct, pictures: updatedProduct.pictures, details: updatedProduct.details, qna: qna });
        } catch (e) {
            return res.status(404).render('products/productPage', { error: 'Product not found' });
        }
    });
    //tablets
    router
        .route('/tablets')
        .get(async (req, res) => {
            //move to validation - object to lowercase
            let url_query = req.query
            let key, keys = Object.keys(url_query);
            let n = keys.length;
            let newobj = {}
            while (n--) {
                key = keys[n];
                newobj[key.toLowerCase()] = url_query[key];
            }
            //
            let search = newobj.search
            if (search != undefined) {
                return res.redirect(`http://localhost:3000/products?search=${search}`)
            }
            //move to validation
            //validation start
            let page = parseInt(newobj.page)
            if (!page) {
                page = 1;
            }
            let manufacturer = newobj.manufacturer
            let error = [];
            try {
                let productList = 0;
                if (!manufacturer) {
                    productList = await productData.getProductsByCategory("tablets");
                } else {
                    productList = await productData.getProductsByCategoryAndManufacturer("tablets", manufacturer);
                }
                let manufactort_List = await productData.getManufacturersOfProductsByCategory("tablets");
                //pagination start
                //fix later
                current = page
                if (current < 1) {
                    current = 1
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the first page of products.`)
                }
                if (current > parseInt(productList.length / 10) + 1) {
                    current = parseInt(productList.length / 10) + 1
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                    error.push(`If you using a URL, you exceeded a page size. So we move you to the last page of products.`)
                }
                else {
                    pageNext = (current + 1)
                    pagePrevious = (current - 1)
                }
                if (pageNext > 1 + parseInt(productList.length / 10)) {
                    pageNext = NaN
                }
                const limit = 10
                const startIndex = (current - 1) * limit
                const endIndex = current * limit
                const resultsProducts = {}
                resultsProducts.page = {
                    "manufacturer": manufacturer,
                    current: current,
                    next: pageNext,
                    previous: pagePrevious,
                    limit: limit
                }

                resultsProducts.results = productList.slice(startIndex, endIndex)
                //pagination end
                res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List, error: error })
            } catch (e) {
                return res.status(404).render({ error: 'Tablets not found' });
            }
        })
    router.get('/tablets/:id', async (req, res) => {
        try {
            //move to validation - object to lowercase
            let url_query = req.query
            let key, keys = Object.keys(url_query);
            let n = keys.length;
            let newobj = {}
            while (n--) {
                key = keys[n];
                newobj[key.toLowerCase()] = url_query[key];
            }
            //
            let search = newobj.search
            if (search != undefined) {
                return res.redirect(`http://localhost:3000/products?search=${search}`)
            }
            //move to validation
            let sku = parseInt(req.params.id)
            //validation start
            sku = sku
            //validation end
            let product = await productData.getProductsByID(sku);
            let qna = await qnaData.getQna(sku);

            if (product.category !== "tablets") {
                res.status(404).render('products/productPage', { error: 'Product not found' });
                return;
            }
            let updatedProduct = await productData.updateProductVisitedCounter(sku);
            res.render('products/productPage', { product: updatedProduct, pictures: updatedProduct.pictures, details: updatedProduct.details, qna: qna });
        } catch (e) {
            res.status(404).render('products/productPage', { error: 'Product not found' });
        }
    });

    router.get('/compare', async (req, res) => {

    })
    //compareProducts not finished
    //Api to fetch the Popular products in each category
    router
        .route('/popular')
        .get(async(req, res) => {

        });
    module.exports = router;
