const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
// const validation = require('../helpers');
const path = require('path');

router
    .route('/')
    .get(async (req, res) => {
        let url_query = req.query
        let error = [];
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

        let price = ""
        if (Array.isArray(price) === true) {
            temp = newobj.price
            price = `${temp[0]}`
            console.log(price)
        }
        else {
            price = newobj.price
        }
        if (price !== undefined) {
            price = price.toLowerCase().trim()
        }


        //validation end
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

            //filter start 
            let minimum = newobj.min
            let maximum = newobj.max
            let onsale = newobj.onsale
            let rating = newobj.rating
            //start of url query
            let query_list = ``
            //min max start

            //min max end

            //current deal
            //Ascending order
            if (price === "ascending") {
                productList.sort((a, b) => {
                    return a.price - b.price
                })
                query_list += `&price=${price}`
            }
            //Descending order 
            if (price === "descending") {
                productList.sort((a, b) => {
                    return b.price - a.price
                })
                query_list += `&price=${price}`
            }
            //end of order

            minimum = parseInt(minimum)
            maximum = parseInt(maximum)
            price = price
            if (minimum > 0 && minimum < maximum) {
                query_list += `&min=${minimum}`
            }
            if (maximum > 0 && maximum > minimum) {
                query_list += `&max=${maximum}`
            }
            if (onsale === "true") {
                query_list += `&onsale=${onsale}`
            }
            if (rating === "true") {
                query_list += `&rating=${rating}`
            }
            console.log(url_query)
            console.log(query_list)
            //filter end 
            resultsProducts.features = {
                price: price,
                minimum: minimum,
                maximum: maximum,
                onsale: onsale,
                rating: rating,
                query_list: query_list
            }

            resultsProducts.page = {
                "search": search,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit,
                query_list: query_list
            }

            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end
            res.render('products/listOfProducts', { productList: resultsProducts, categoryList: categoryList, error: error })
        } catch (e) {
            return res.status(404).json('products/listOfProducts', { error: e });
        }
    })
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
            return res.redirect(`/api/products?search=${search}`)
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
            return res.redirect(`/api/products?search=${search}`)
        }
        //move to validation
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
            return res.redirect(`/api/products?search=${search}`)
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
            return res.redirect(`/api/products?search=${search}`)
        }
        //move to validation
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
            return res.redirect(`/api/products?search=${search}`)
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
            return res.redirect(`/api/products?search=${search}`)
        }
        //move to validation
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
