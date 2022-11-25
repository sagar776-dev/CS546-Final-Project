const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const funcProducts = data.products

const axios = require('axios');
const fs = require('fs');

const main = async () => {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    let API_KEY = ""

    const data = await funcProducts.getProductsByAxios(API_KEY)

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

    try {
        for (let i in data) {
            await funcProducts.addProductByAxios(
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
                data[i].details
            );
        }
    } catch (e) {
        console.log(e)
    }

    console.log('Done!');
    await dbConnection.closeConnection();
};

main()