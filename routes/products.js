const express = require("express");
const router = express.Router();
const data = require("../data");
const productData = data.products;
const usersData = data.users;
const xss = require("xss");

// const validation = require('../helpers');
const path = require("path");
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
            newobj[key.toLowerCase()] = xss(url_query[key]);
        }
        //
        //validation start
        let page = parseInt(xss(newobj.page))
        if (!page) {
            page = 1;
        }
        let search = xss(newobj.search)
        try {
            search = validation.checkString(search, "search")
        } catch (e) {
            error.push(e)
        }
        let minimum = xss(newobj.min)
        try {
            minimum = validation.checkNumber(minimum, "minimum")
        } catch (e) {
            error.push(e)
        }
        let maximum = xss(newobj.max)
        try {
            maximum = validation.checkNumber(maximum, "maximum")
        } catch (e) {
            error.push(e)
        }
        let instoreavailability = xss(newobj.instoreavailability)
        try {
            instoreavailability = validation.checkString(instoreavailability, "instoreavailability")
        } catch (e) {
            error.push(e)
        }
        let rating = xss(newobj.rating)
        try {
            rating = validation.checkString(rating, "rating")
        } catch (e) {
            error.push(e)
        }
        let customerreviewcount = xss(newobj.customerreviewcount)
        try {
            customerreviewcount = validation.checkString(customerreviewcount, "customerreviewcount")
        } catch (e) {
            error.push(e)
        }
        let visitedtimes = xss(newobj.visitedtimes)
        try {
            visitedtimes = validation.checkString(visitedtimes, "visitedtimes")
        } catch (e) {
            error.push(e)
        }
        //validation end
        try {
            let productList = 0;
            let categoryList = await productData.getCategoryOfProducts();
            const resultsProducts = {}
            //filter start 
            //start of url query
            let query_list = ``
            //price start
            let price = ""
            if (!search) {
                productList = await productData.getAllProducts();
            } else {
                if (Array.isArray(search)) {
                    productList = await productData.getProductByName(search[0]);
                    search = search[0]
                }
                else {
                    productList = await productData.getProductByName(search);
                    if (productList.length === 0) {
                        productList = await productData.getAllProducts();
                        error.push(`Product with a name of "${search}" Not Found`)
                    }
                }
            }
            if (Array.isArray(price) === true) {
                temp = xss(newobj.price)
                price = `${temp[0]}`
            }
            else {
                price = xss(newobj.price)
            }
            if (price !== undefined) {
                price = price.toLowerCase().trim()
            }
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
            if (isNaN(minimum)) {
                minimum = 0
            }
            if (isNaN(maximum)) {
                maximum = 10000
            }
            // error.push("Minimum is empty or containing letters")
            // error.push("Maximum is empty or containing letters")
            minimum = parseInt(minimum)
            maximum = parseInt(maximum)
            if (minimum >= maximum) {
                error.push("Minimum more or equal to Maximum")
            }
            else {
                if (minimum > 0) {
                    query_list += `&min=${minimum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price >= minimum
                    })
                }
                if (maximum > 0 && maximum < 10000) {
                    query_list += `&max=${maximum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price <= maximum
                    })
                }
            }
            if (rating === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewAverage - a.customerReviewAverage
                })
                query_list += `&rating=${rating}`
            }
            if (instoreavailability === "true") {
                productList = productList.filter((object) => {
                    return object.inStoreAvailability === true
                })
                query_list += `&inStoreAvailability=${instoreavailability}`
                //console.log(productList)
            }
            if (customerreviewcount === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewCount - a.customerReviewCount
                })
                query_list += `&customerReviewCount=${customerreviewcount}`
                //console.log(productList)
            }
            if (visitedtimes === "true") {
                productList = productList.sort((a, b) => {
                    return a.visitedTimes - b.visitedTimes
                })
                query_list += `&visitedTimes=${visitedtimes}`
                //console.log(productList)
            }
            resultsProducts.features = {
                price: price,
                minimum: minimum,
                maximum: maximum,
                inStoreAvailability: instoreavailability,
                rating: rating,
                query_list: query_list
            }
            //filter end 
            if (productList.length === 0) {
                productList = await productData.getAllProducts();
                error.push("Could not find products with this filter")
            }
            // console.log(productList.length)
            // console.log(error)
            // console.log(url_query)
            // console.log(query_list)
            //page start
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
            resultsProducts.page = {
                "search": search,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit,
                query_list: query_list
            }
            //page end
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
        let error = [];
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = xss(url_query[key]);
        }
        //
        let search = xss(newobj.search)
        try {
            search = validation.checkString(search, "search")
        } catch (e) {
            error.push(e)
        }
        let minimum = xss(newobj.min)
        try {
            minimum = validation.checkNumber(minimum, "minimum")
        } catch (e) {
            error.push(e)
        }
        let maximum = xss(newobj.max)
        try {
            maximum = validation.checkNumber(maximum, "maximum")
        } catch (e) {
            error.push(e)
        }
        let instoreavailability = xss(newobj.instoreavailability)
        try {
            instoreavailability = validation.checkString(instoreavailability, "instoreavailability")
        } catch (e) {
            error.push(e)
        }
        let rating = xss(newobj.rating)
        try {
            rating = validation.checkString(rating, "rating")
        } catch (e) {
            error.push(e)
        }
        let customerreviewcount = xss(newobj.customerreviewcount)
        try {
            customerreviewcount = validation.checkString(customerreviewcount, "customerreviewcount")
        } catch (e) {
            error.push(e)
        }
        let visitedtimes = xss(newobj.visitedtimes)
        try {
            visitedtimes = validation.checkString(visitedtimes, "visitedtimes")
        } catch (e) {
            error.push(e)
        }
        let manufacturer = xss(newobj.manufacturer)
        try {
            manufacturer = validation.checkString(manufacturer, "manufacturer")
        } catch (e) {
            error.push(e)
        }
        if (search != undefined && search.length != 0) {
            return res.redirect(`/api/products?search=${search}`)
        }
        //validation start
        let page = parseInt(xss(newobj.page))
        if (!page) {
            page = 1;
        }

        try {
            let productList = 0;
            if (!manufacturer) {
                productList = await productData.getProductsByCategory("laptops");
            } else {
                productList = await productData.getProductsByCategoryAndManufacturer("laptops", manufacturer);
            }
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("laptops");
            //pagination start
            //start of url query
            let query_list = ``
            //price start
            let price = ""
            if (manufacturer !== undefined && manufacturer.length != 0) {
                if (Array.isArray(manufacturer)) {
                    manufacturer = manufacturer[0]
                }
                query_list += `&manufacturer=${manufacturer}`
            }
            if (Array.isArray(price) === true) {
                temp = xss(newobj.price)
                price = `${temp[0]}`
                // console.log(price)
            }
            else {
                price = xss(newobj.price)
            }
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
            if (isNaN(minimum)) {
                minimum = 0
            }
            if (isNaN(maximum)) {
                maximum = 10000
            }
            if (minimum > maximum) {
                error.push("Minimum more or equal to Maximum")
            }
            else {
                if (minimum > 0) {
                    query_list += `&min=${minimum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price >= minimum
                    })
                }
                if (maximum > 0 && maximum < 10000) {
                    query_list += `&max=${maximum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price <= maximum
                    })
                }
            }
            if (rating === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewAverage - a.customerReviewAverage
                })
                query_list += `&rating=${rating}`
            }
            if (instoreavailability === "true") {
                productList = productList.filter((object) => {
                    return object.inStoreAvailability === true
                })
                query_list += `&inStoreAvailability=${instoreavailability}`
                //console.log(productList)
            }
            if (customerreviewcount === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewCount - a.customerReviewCount
                })
                query_list += `&customerReviewCount=${customerreviewcount}`
                //console.log(productList)
            }
            if (visitedtimes === "true") {
                productList = productList.sort((a, b) => {
                    return a.visitedTimes - b.visitedTimes
                })
                query_list += `&visitedTimes=${visitedtimes}`
                //console.log(productList)
            }

            if (productList.length === 0) {
                productList = await productData.getProductsByCategory("laptops");
                error.push("Could not find products with this filter")
            }

            //fix later
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
                "manufacturer": manufacturer,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit,
                query_list: query_list
            }
            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end
            res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List, error: error })
        } catch (e) {
            return res.status(404).render('products/listOfProducts', { error: 'Laptops not found' });
        }
    })
router.get("/laptops/:id", async (req, res) => {
    try {
        //move to validation - object to lowercase
        let url_query = req.query;
        let key,
            keys = Object.keys(url_query);
        let n = keys.length;
        let newobj = {};
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = xss(url_query[key]);
        }
        //
        let search = newobj.search;
        if (search != undefined) {
            return res.redirect(`/api/products?search=${search}`);
        }
        //move to validation
        let sku = parseInt(xss(req.params.id));
        //validation start
        sku = sku;
        //validation end
        let product = await productData.getProductsByID(sku);
        // check category of sku
        //cause we can use same id for tablets and phones
        let updatedProduct = await productData.updateProductVisitedCounter(sku);
        let isWishlisted = await usersData.addProductToHistory(
            sku,
            req.session.username
        );
        console.log(isWishlisted);
        if (product.category !== "laptops") {
            return res
                .status(404)
                .render("products/productPage", { error: "Product not found" });
        }
        // end
        //console.log(product);
        return res.render("products/productPage", {
            product: product,
            pictures: product.pictures,
            details: product.details,
            isWishlisted: isWishlisted
        });
    } catch (e) {
        console.log(e);
        return res
            .status(404)
            .render("products/error", { error: "Product not found" });
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
        let error = []
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = xss(url_query[key]);
        }
        //
        let search = xss(newobj.search)
        try {
            search = validation.checkString(search, "search")
        } catch (e) {
            error.push(e)
        }
        let minimum = xss(newobj.min)
        try {
            minimum = validation.checkNumber(minimum, "minimum")
        } catch (e) {
            error.push(e)
        }
        let maximum = xss(newobj.max)
        try {
            maximum = validation.checkNumber(maximum, "maximum")
        } catch (e) {
            error.push(e)
        }
        let instoreavailability = xss(newobj.instoreavailability)
        try {
            instoreavailability = validation.checkString(instoreavailability, "instoreavailability")
        } catch (e) {
            error.push(e)
        }
        let rating = xss(newobj.rating)
        try {
            rating = validation.checkString(rating, "rating")
        } catch (e) {
            error.push(e)
        }
        let customerreviewcount = xss(newobj.customerreviewcount)
        try {
            customerreviewcount = validation.checkString(customerreviewcount, "customerreviewcount")
        } catch (e) {
            error.push(e)
        }
        let visitedtimes = xss(newobj.visitedtimes)
        try {
            visitedtimes = validation.checkString(visitedtimes, "visitedtimes")
        } catch (e) {
            error.push(e)
        }
        let manufacturer = xss(newobj.manufacturer)
        try {
            manufacturer = validation.checkString(manufacturer, "manufacturer")
        } catch (e) {
            error.push(e)
        }

        if (search != undefined && search.length != 0) {
            return res.redirect(`/api/products?search=${search}`)
        }
        //move to validation
        //validation start
        let page = parseInt(xss(newobj.page))
        if (!page) {
            page = 1;
        }
        try {
            let productList = 0;
            if (!manufacturer) {
                productList = await productData.getProductsByCategory("phones");
            } else {
                productList = await productData.getProductsByCategoryAndManufacturer("phones", manufacturer);
            }
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("phones");
            //pagination start
            //start of url query
            let query_list = ``
            //price start
            let price = ""
            if (manufacturer !== undefined) {
                if (Array.isArray(manufacturer)) {
                    manufacturer = manufacturer[0]
                }
                query_list += `&manufacturer=${manufacturer}`
            }
            if (Array.isArray(price) === true) {
                temp = xss(newobj.price)
                price = `${temp[0]}`
                // console.log(price)
            }
            else {
                price = xss(newobj.price)
            }
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
            if (isNaN(minimum)) {
                minimum = 0
            }
            if (isNaN(maximum)) {
                maximum = 10000
            }
            if (minimum > maximum) {
                error.push("Minimum more or equal to Maximum")
            }
            else {
                if (minimum > 0) {
                    query_list += `&min=${minimum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price >= minimum
                    })
                }
                if (maximum > 0 && maximum < 10000) {
                    query_list += `&max=${maximum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price <= maximum
                    })
                }
            }
            if (rating === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewAverage - a.customerReviewAverage
                })
                query_list += `&rating=${rating}`
            }
            if (instoreavailability === "true") {
                productList = productList.filter((object) => {
                    return object.inStoreAvailability === true
                })
                query_list += `&inStoreAvailability=${instoreavailability}`
                //console.log(productList)
            }
            if (customerreviewcount === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewCount - a.customerReviewCount
                })
                query_list += `&customerReviewCount=${customerreviewcount}`
                //console.log(productList)
            }
            if (visitedtimes === "true") {
                productList = productList.sort((a, b) => {
                    return a.visitedTimes - b.visitedTimes
                })
                query_list += `&visitedTimes=${visitedtimes}`
                //console.log(productList)
            }

            if (productList.length === 0) {
                productList = await productData.getProductsByCategory("phones");
                error.push("Could not find products with this filter")
            }
            //fix later
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
                "manufacturer": manufacturer,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit,
                query_list: query_list
            }
            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end
            res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List, error: error })
        } catch (e) {
            return res.status(404).render('products/listOfProducts', { error: 'Phones not found' });
        }
    })
router.get("/phones/:id", async (req, res) => {
    try {
        //move to validation - object to lowercase
        let url_query = req.query;
        let key,
            keys = Object.keys(url_query);
        let n = keys.length;
        let newobj = {};
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = url_query[key];
        }
        //
        let search = newobj.search;
        if (search != undefined) {
            return res.redirect(`/api/products?search=${search}`);
        }
        //move to validation
        let sku = parseInt(req.params.id);
        //validation start
        sku = sku;
        //validation end
        let product = await productData.getProductsByID(sku);
        let updatedProduct = await productData.updateProductVisitedCounter(sku);
        let isWishlisted = await usersData.addProductToHistory(
            sku,
            req.session.username
        );
        if (product.category !== "phones") {
            return res
                .status(404)
                .render("products/productPage", { error: "Product not found" });
        }
        return res.render("products/productPage", {
            product: product,
            pictures: product.pictures,
            details: product.details,
            isWishlisted: isWishlisted,
        });
    } catch (e) {
        return res
            .status(404)
            .render("products/error", { error: "Product not found" });
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
        let error = [];
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = xss(url_query[key]);
        }
        //
        let search = xss(newobj.search)
        try {
            search = validation.checkString(search, "search")
        } catch (e) {
            error.push(e)
        }
        let minimum = xss(newobj.min)
        try {
            minimum = validation.checkNumber(minimum, "minimum")
        } catch (e) {
            error.push(e)
        }
        let maximum = xss(newobj.max)
        try {
            maximum = validation.checkNumber(maximum, "maximum")
        } catch (e) {
            error.push(e)
        }
        let instoreavailability = xss(newobj.instoreavailability)
        try {
            instoreavailability = validation.checkString(instoreavailability, "instoreavailability")
        } catch (e) {
            error.push(e)
        }
        let rating = xss(newobj.rating)
        try {
            rating = validation.checkString(rating, "rating")
        } catch (e) {
            error.push(e)
        }
        let customerreviewcount = newobj.customerreviewcount
        try {
            customerreviewcount = validation.checkString(customerreviewcount, "customerreviewcount")
        } catch (e) {
            error.push(e)
        }
        let visitedtimes = xss(newobj.visitedtimes)
        try {
            visitedtimes = validation.checkString(visitedtimes, "visitedtimes")
        } catch (e) {
            error.push(e)
        }
        let manufacturer = xss(newobj.manufacturer)
        try {
            manufacturer = manufacturer.checkString(manufacturer, "manufacturer")
        } catch (e) {
            error.push(e)
        }
        if (search != undefined && search.length != 0) {
            return res.redirect(`/api/products?search=${search}`)
        }
        //move to validation
        //validation start
        let page = parseInt(xss(newobj.page))
        if (!page) {
            page = 1;
        }

        try {
            let productList = 0;
            if (!manufacturer) {
                productList = await productData.getProductsByCategory("tablets");
            } else {
                productList = await productData.getProductsByCategoryAndManufacturer("tablets", manufacturer);
            }
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("tablets");
            //pagination start
            //start of url query
            let query_list = ``
            //price start
            let price = ""
            if (manufacturer !== undefined) {
                if (Array.isArray(manufacturer)) {
                    manufacturer = manufacturer[0]
                }
                query_list += `&manufacturer=${manufacturer}`
            }
            if (Array.isArray(price) === true) {
                temp = xss(newobj.price)
                price = `${temp[0]}`
                // console.log(price)
            }
            else {
                price = xss(newobj.price)
            }
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
            if (isNaN(minimum)) {
                minimum = 0
            }
            if (isNaN(maximum)) {
                maximum = 10000
            }
            if (minimum > maximum) {
                error.push("Minimum more or equal to Maximum")
            }
            else {
                if (minimum > 0) {
                    query_list += `&min=${minimum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price >= minimum
                    })
                }
                if (maximum > 0 && maximum < 10000) {
                    query_list += `&max=${maximum}`
                    //sort 
                    productList = productList.filter((object) => {
                        return object.price <= maximum
                    })
                }
            }
            if (rating === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewAverage - a.customerReviewAverage
                })
                query_list += `&rating=${rating}`
            }
            if (instoreavailability === "true") {
                productList = productList.filter((object) => {
                    return object.inStoreAvailability === true
                })
                query_list += `&inStoreAvailability=${instoreavailability}`
                //console.log(productList)
            }
            if (customerreviewcount === "true") {
                productList = productList.sort((a, b) => {
                    return b.customerReviewCount - a.customerReviewCount
                })
                query_list += `&customerReviewCount=${customerreviewcount}`
                //console.log(productList)
            }
            if (visitedtimes === "true") {
                productList = productList.sort((a, b) => {
                    return a.visitedTimes - b.visitedTimes
                })
                query_list += `&visitedTimes=${visitedtimes}`
                //console.log(productList)
            }
            if (productList.length === 0) {
                productList = await productData.getProductsByCategory("tablets");
                error.push("Could not find products with this filter")
            }
            //fix later
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
                "manufacturer": manufacturer,
                current: current,
                next: pageNext,
                previous: pagePrevious,
                limit: limit,
                query_list: query_list
            }

            resultsProducts.results = productList.slice(startIndex, endIndex)
            //pagination end
            res.render('products/listOfProducts', { productList: resultsProducts, manufactort_List: manufactort_List, error: error })
        } catch (e) {
            return res.status(404).render({ error: 'Tablets not found' });
        }
    })
router.get("/tablets/:id", async (req, res) => {
    try {
        //move to validation - object to lowercase
        let url_query = req.query;
        let key,
            keys = Object.keys(url_query);
        let n = keys.length;
        let newobj = {};
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = url_query[key];
        }
        //
        let search = newobj.search;
        if (search != undefined) {
            return res.redirect(`/api/products?search=${search}`);
        }
        //move to validation
        let sku = parseInt(req.params.id);
        //validation start
        sku = sku;
        //validation end
        let product = await productData.getProductsByID(sku);
        let updatedProduct = await productData.updateProductVisitedCounter(sku);
        let isWishlisted = await usersData.addProductToHistory(
            sku,
            req.session.username
        );
        return res.render("products/productPage", {
            product: product,
            pictures: product.pictures,
            details: product.details,
            isWishlisted: isWishlisted
        });
    } catch (e) {
        return res
            .status(404)
            .render("products/error", { error: "Product not found" });
    }
});

router
    .get("/compare", async (req, res) => {
        let products = [
            {
                sku: 6447818,
                name: "Acer - Chromebook Spin 514 Laptop– Convertible-14” Full HD Touch –Ryzen 3 3250C– GB DDR4 Memory–64GB eMMC Flash Memory",
                url: "https://api.bestbuy.com/click/-/6447818/pdp",
                "Processor Model": "AMD Ryzen 3 3000 Series",
                "System Memory (RAM)": "4 gigabytes",
                Graphics: "AMD Radeon",
                "Screen Resolution": "1920 x 1080 (Full HD)",
                "Storage Type": "eMMC",
                "Total Storage Capacity": "64 gigabytes",
                "Screen Size": "14 inches",
                "Touch Screen": "Yes",
                "Processor Model Number": "3250C",
                "Operating System": "Chrome OS",
                "Battery Type": "Lithium-ion",
                "Backlit Keyboard": "Yes",
                Brand: "Acer",
                "Model Number": "CP514-1H-R4HQ",
                "Year of Release": "2020",
                "Color Category": "Silver",
            },
            {
                sku: 6518252,
                name: 'Dell - XPS 13 Plus 13.4" OLED Touch-Screen Laptop – 12th Gen Intel Evo i7 - 16GB Memory - 512GB SSD - Silver',
                url: "https://api.bestbuy.com/click/-/6518252/pdp",
                "Processor Model": "Intel 12th Generation Core i7 Evo Platform",
                "System Memory (RAM)": "16 gigabytes",
                Graphics: "Intel Iris Xe Graphics",
                "Screen Resolution": "3456 x 2160",
                "Storage Type": "SSD",
                "Total Storage Capacity": "512 gigabytes",
                "Screen Size": "13.4 inches",
                "Touch Screen": "Yes",
                "Processor Model Number": "1260P",
                "Operating System": "Windows 11 Home",
                "Battery Type": "Lithium-ion",
                "Backlit Keyboard": "Yes",
                Brand: "Dell",
                "Model Number": "BBY-K2PKKFX",
                "Year of Release": "2022",
                "Color Category": "Silver",
            },
        ];
        let headers = Object.keys(products[0]);
        let comparisonArray = [];
        for (let header of headers) {
            if (header.trim().toLowerCase() !== "sku") {
                let arr = [header.charAt(0).toUpperCase() + header.slice(1)];
                for (let product of products) {
                    arr.push(product[header]);
                }
                comparisonArray.push(arr);
            }
        }
        res.render("products/compareproducts", {
            products: comparisonArray,
        });
    })
    .post("/compare", async (req, res) => {
        let errorMessage = "";
        console.log("Request body ", req.body);
        let products = req.body.compareList;
        products = JSON.parse(products);
        try {
            if (!products) errorMessage = "Error: No products to compare";
            products = JSON.parse(products);
            if (products.length === 0) errorMessage = "Error: No products to compare";
            else if (products.length === 1)
                errorMessage = "Error: Only one product in the compare list";

            if (errorMessage.length > 0) {
                throw errorMessage;
            }
            console.log("Products ", products);
            //products = JSON.parse(products);
            let prods = [];
            let categories = ["laptops", "phones", "tablets"];

            //Check for same category
            console.log("Compare list ", products, products.length);
            for (let prod of products) {
                if (!prods.includes(prod.type.toLowerCase())) {
                    prods.push(prod.type.toLowerCase());
                }
            }
            if (prods.length !== 1)
                throw "Error: cannot compare products of different category";

            //Check for duplicate product
            prods = [];
            for (let prod of products) {
                if (!prods.includes(prod.id)) {
                    prods.push(prod.id);
                }
            }
            console.log(prods);
            if (prods.length !== products.length)
                throw "Error: cannot compare product with itself";

            let result;
            let productSKUs = [];
            for (let product of products) {
                productSKUs.push(Number(product.id));
            }
            if (products[0].type.toLowerCase() === "laptops") {
                result = await productData.compareLaptops(productSKUs);
            } else if (products[0].type.toLowerCase() === "phones") {
                result = await productData.comparePhones(productSKUs);
            } else {
                result = await productData.compareTablets(productSKUs);
            }
            console.log("Comparison result before", result[0]);
            let headers = Object.keys(result[0][0]);
            let comparisonArray = [];
            for (let header of headers) {
                if (header.trim().toLowerCase() !== "sku") {
                    let arr = [header.charAt(0).toUpperCase() + header.slice(1)];
                    for (let product of result[0]) {
                        arr.push(product[header]);
                    }
                    comparisonArray.push(arr);
                }
            }
            console.log("Comparison result ", comparisonArray);
            res.render("products/compareproducts", {
                products: comparisonArray,
            });
        } catch (e) {
            console.log("error ", e);
            res.render("products/compareproducts", {
                error: e,
            });
        }
    });

//compareProducts not finished
module.exports = router;
