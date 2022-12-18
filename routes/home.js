const express = require("express");
const router = express.Router();
const data = require('../data');
const productData = data.products;


router
    .route("/")
    .get(async(req, res) => {
        try {
            let popularProducts = await productData.getPopularProducts();

            return res.render("home/homepage", {
                popularProducts: popularProducts,
                compareList: [{name: "Asus TUF 15", sku:134556},{name: "Asus TUF 14", sku:934088}]
            });
        } catch (error) {
            return res.render("home/homepage", {
                error: error
            });
        }
    });

module.exports = router;