const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
// const validation = require('../helpers');

router
    .route('/')
    .get(async (req, res) => {
        try {
            let productList = await productData.getAllProducts();
            let categoryList = await productData.getCategoryOfProducts();
            res.render('products/listOfProducts', { productList: productList, categoryList: categoryList })
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
            res.render('products/name', { productList: productList });
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })

//laptops
router
    .route('/laptops')
    .get(async (req, res) => {
        try {
            let product_List = await productData.getProductsByCategory("laptops");
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("laptops");
            res.render('products/category', { product_List: product_List, manufactort_List: manufactort_List })
        } catch (e) {
            res.status(404).json({ error: 'Laptops not found' });
        }
    })
    .post(async (req, res) => {
        let manufacturer = req.body.ManufacturerOfCategoryName;
        //validation start
        manufacturer = manufacturer
        //validation end
        try {
            let product_List = await productData.getProductsByCategoryAndManufacturer("laptops", manufacturer);
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("laptops");
            res.render('products/category', { product_List: product_List, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).json({ errors: e });
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
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        // end
        res.render('products/productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).json({ error: 'Product not found' });
    }
});
//phones
router
    .route('/phones')
    .get(async (req, res) => {
        try {
            let product_List = await productData.getProductsByCategory("phones");
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("phones");
            res.render('products/category', { product_List: product_List, manufactort_List: manufactort_List })
        } catch (e) {
            res.status(404).json({ error: 'Phones not found' });
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
            res.render('products/category', { product_List: product_List, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).json({ errors: e });
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
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.render('products/productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).json({ error: 'Product not found' });
    }
});
//tablets
router
    .route('/tablets')
    .get(async (req, res) => {
        try {
            let product_List = await productData.getProductsByCategory("tablets");
            let manufactort_List = await productData.getManufacturersOfProductsByCategory("tablets");
            res.render('products/category', { product_List: product_List, manufactort_List: manufactort_List })
        } catch (e) {
            res.status(404).json({ error: 'Tablets not found' });
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
            res.render('products/category', { product_List: product_List, manufactort_List: manufactort_List });
        } catch (e) {
            return res.status(404).json({ errors: e });
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
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.render('products/productPage', { product: product, pictures: product.pictures, details: product.details })
    } catch (e) {
        res.status(404).json({ error: 'Product not found' });
    }
});

//compareProducts not finished
module.exports = router;
