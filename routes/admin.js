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
        //move to validation - object to lowercase
        let key, keys = Object.keys(url_query);
        let n = keys.length;
        let newobj = {}
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = url_query[key];
        }
        //validation start
        let findsku = parseInt(newobj.findsku)
        console.log(findsku)
        //validation end
        let product = {};
        let pictures = [];
        let details = {};
        try {
            if (findsku !== undefined) {
                product = await productData.getProductsByID(findsku)
                //pictures 
                //details
            }
        } catch (e) {
            return res.status(400).render('admin/admin_main', { error: e });
        }
        try {
            res.render('admin/update_product', { product: product, pictures: product.pictures, details: product.details })
        } catch (e) {
            return res.status(404).render('admin/update_product', { error: e });
        }
    })
    .post(async (req, res) => {
        //update
        try {
            res.render('admin/admin_main')
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
router
    .route('/:id')
    .put(async (req, res) => {
        //add
        req.params.id = parseInt(req.params.id);
        try {
            let a = await productData.getProductsByID(req.params.id)
            res.render('admin/admin_main')
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
router
    .route('/:id')
    .delete(async (req, res) => {
        //remove
        try {
            //validation start
            let deleteSKU = parseInt(req.params.id);
            console.log(deleteSKU)
            //validation end
            let a = await productData.getProductsByID(deleteSKU)
            await productData.removeProduct(deleteSKU)
            res.render('admin/admin_main', { SKU_ID: deleteSKU })
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
router
    .route('/checkUsers')
    .get(async (req, res) => {
        try {
            res.render('admin/admin_main')
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })

module.exports = router;
