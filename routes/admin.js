const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
const validation = require('../helper/adminValidation');
const xss = require('xss');

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

            product.name = xss(product.name);
            product.manufacturer = xss(product.manufacturer);
            product.startDate = xss(product.startDate);
            product.url = xss(product.url);
            product.Description = xss(product.Description);
            product.category = xss(product.category);

            for(let i=0;i<product.pictures.length;i++){
                product.pictures[i] = xss(product.pictures[i]);
            }

            for(let i=0;i<product.details.length;i++){
                product.details[i].name = xss(product.details[i].name);
                product.details[i].value = xss(product.details[i].value);
            }

            product = validation.inputValidation(product);

            const maxSku = await productData.getMaxSku();
            const skuId = maxSku + 1;

            const responseMessage = await productData.addProduct(skuId, product.name, product.manufacturer, product.category, product.startDate, 
                product.price, product.url, true, product.Description, product.pictures, product.details);
            
            return res.status(200).json({responseMessage: responseMessage});

        } catch (e) {
            //console.log(e);
            return res.status(200).json({ error: e.toString() });
        }
    })
    .post(async (req, res) => {
        //update
        try {
            let product = req.body;

            product.name = xss(product.name);
            product.manufacturer = xss(product.manufacturer);
            product.startDate = xss(product.startDate);
            product.url = xss(product.url);
            product.Description = xss(product.Description);
            product.category = xss(product.category);

            for(let i=0;i<product.pictures.length;i++){
                product.pictures[i] = xss(product.pictures[i]);
            }

            for(let i=0;i<product.details.length;i++){
                product.details[i].name = xss(product.details[i].name);
                product.details[i].value = xss(product.details[i].value);
            }
            product.skuId = validation.validateSkuId(product.skuId);
            product = validation.inputValidation(product);

            // upload(req, res, function(error){
            //     if(error) {
            //         //console.log(error);
            //     }
            //     product.pictures.push(req.file.path);
            // });

            const responseMessage = await productData.updateProduct(product.skuId, product.name, product.manufacturer, product.startDate,
                product.price, product.url, true, product.Description, product.pictures, product.details);

            return res.status(200).json({responseMessage:responseMessage});
        } catch (e) {
            //console.log(e);
            return res.status(200).json({ error: e.toString()});
        }
    })
// router
//     .route('/:id')
//     .delete(async (req, res) => {
//         //remove
//         let skuId = req.body.skuId;
//         try {
//             //validation start
//             skuId = validation.validateSkuId(skuId);
//             skuId = parseInt(skuId);
//             let responseMessage = await productData.removeProduct(skuId);
//             return res.status(200).json({responseMessage: responseMessage});
//         } catch (error) {
//             //console.log(error);
//             return res.status(200).json({ error: error });
//         }
//     });

router
    .route('/delete/:id')
    .get(async (req, res) => {
        //remove
        let skuId = req.params.id;
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
