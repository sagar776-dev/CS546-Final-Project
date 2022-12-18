const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
const validation = require('../helper/adminValidation');
//const multer = require('multer');

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// var upload = multer({ storage: storage }).single("pictures");

router
    .route('/')
    .get(async (req, res) => {
        try {
            res.render('admin/admin_main');
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
    .put(async (req, res) => {
        //add
        try {
            let product = req.body;
            product = validation.inputValidation(product);

            const maxSku = await productData.getMaxSku();
            const skuId = maxSku + 1;

            const responseMessage = await productData.addProduct(skuId, product.name, product.manufacturer, product.category, product.startDate, 
                product.price, product.url, true, product.description, product.pictures, product.details);
            
            return res.status(200).json({responseMessage: responseMessage});

        } catch (e) {
            console.log(e);
            return res.status(200).json({ error: e.toString() });
        }
    })
    .post(async (req, res) => {
        //update
        try {
            let product = req.body;
            product.skuId = validation.validateSkuId(product.skuId);
            product = validation.inputValidation(product);

            // upload(req, res, function(error){
            //     if(error) {
            //         console.log(error);
            //     }
            //     product.pictures.push(req.file.path);
            // });

            const responseMessage = await productData.updateProduct(product.skuId, product.name, product.manufacturer, product.startDate,
                product.price, product.url, true, product.description, product.pictures, product.details);

            return res.status(200).json({responseMessage:responseMessage});
        } catch (e) {
            console.log(e);
            return res.status(200).json({ error: e.toString()});
        }
    })
    .delete(async (req, res) => {
        //remove
        let skuId = req.body.skuId;
        try {
            //validation start
            skuId = validation.validateSkuId(skuId);
            skuId = parseInt(skuId);
            let responseMessage = await productData.removeProduct(skuId);
            return res.status(200).json({responseMessage: responseMessage});
        } catch (error) {
            console.log(error);
            return res.status(200).json({ error: error });
        }
    });

router
    .route('/addproduct')
    .get(async (req, res) => {
        try {
            res.render('admin/addproduct');
        } catch (error) {
            return res.status(500).json({error: error});
        }
    });

router
    .route('/updateproduct')
    .get(async (req, res) => {
        try {
            res.render('admin/updateproduct');
        } catch (error) {
            return res.status(500).json({error: error});
        }
    });

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
