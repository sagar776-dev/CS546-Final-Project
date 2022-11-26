const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const funcProducts = data.products

const axios = require('axios');
const fs = require('fs');

const main = async () => {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    let API_KEY = ""
    let data;
    if (API_KEY.length === 0) {
        data = require('./laptops.json');
        //console.log(data)
    } else {
        data = await funcProducts.getProductsByAxios(API_KEY)
        //save data in tasks
        let temp = JSON.stringify(data)
        //console.log(temp)
        fs.writeFile(__dirname + "/../tasks/laptops.json", temp, function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
    }
    console.log("addProductByAxios")
    try {
        for (let i in data) {
            console.log(await funcProducts.addProductByAxios(
                data[i].sku,
                data[i].name,
                data[i].customerReviewAverage,
                data[i].customerReviewCount,
                data[i].manufacturer,
                data[i].startDate,
                data[i].regularPrice,
                data[i].salePrice,
                data[i].onSale,
                data[i].url,
                data[i].inStoreAvailability,
                data[i].shortDescription,
                data[i].longDescription,
                data[i].image,
                data[i].largeFrontImage,
                data[i].mediumImage,
                data[i].thumbnailImage,
                data[i].angleImage,
                data[i].backViewImage,
                data[i].details,
                "laptop"
            ));
        }
    } catch (e) {
        console.log(e)
    }
    //addProduct 1111111
    console.log()
    console.log("addProduct")
    try {
        //sku,name,manufacturer,startDate,price,url,inStoreAvailability,Description,pictures,details,category
        console.log(await funcProducts.addProduct(
            1111111,
            "Yes",
            "Yes manufacturer",
            "Yes startDate",
            "Yes price",
            "Yes url",
            "Yes inStoreAvailability",
            "Yes Description",
            "Yes pictures",
            "Yes details",
            "laptop"
        ));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getProductsByID")
    try {
        console.log(await funcProducts.getProductsByID(111111));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getProductsByManufacturer")
    try {
        await funcProducts.getProductsByManufacturer("Acer");
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getAllProducts")
    try {
        await funcProducts.getAllProducts();
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("updateProduct")
    try {
        // sku,name, manufacturer,startDate,price,url,inStoreAvailability,Description,pictures,details
        console.log(await funcProducts.updateProduct(
            111111,
            "Best",
            "Markovka",
            "20-29-2022",
            1234.99,
            "utl",
            true,
            "Description",
            [1, 2, 3],
            [{ "0": 0 }, { "1": 1 }, { "2": 2 }]));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("removeProduct")
    try {
        // sku,name, manufacturer,startDate,price,url,inStoreAvailability,Description,pictures,details
        console.log(await funcProducts.removeProduct(6504594));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("compareProducts(111111)")
    try {
        console.log(await funcProducts.compareProducts(1111111));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("compareProducts(111111, 6504591, 5776917)")
    try {
        console.log(await funcProducts.compareProducts(111111, 6504591, 5776917));
    } catch (e) {
        console.log(e)
    }
    console.log('Done!');
    await dbConnection.closeConnection();
};

main()