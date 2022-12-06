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
            res.render('admin/admin_main')
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
router
    .route('/addProduct')
    .post(async (req, res) => {
        try {
            res.render('admin/admin_main')
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
router
    .route('/updateProduct')
    .post(async (req, res) => {
        try {
            res.render('admin/admin_main')
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
router
    .route('/removeProduct')
    .delete(async (req, res) => {
        try {
            //validation start
            req.params.productId = req.params.productId;
            //validation end
        } catch (e) {
            return res.status(404).json({ error: e });
        }
        try {
            let a = await productData.getProductsByID(req.params.productId)
            await productData.removeProduct(req.params.productId)
            res.render('admin/remove', { SKU_ID: req.params.productId })
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
