const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const funcProducts = data.products
const fs = require('fs');

const main = async () => {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    let API_KEY = ""
    let data_lap, data_tab, data_pho;
    if (API_KEY.length === 0) {
        data_lap = require('./laptops.json');
        data_tab = require('./tablets.json');
        data_pho = require('./phones.json');
        //console.log(data)
    } else {
        category_lap = "abcat0502000"
        category_tab = "pcmcat209000050006"
        category_pho = "pcmcat209400050001"
        data_lap = await funcProducts.getProductsByAxios(category_lap, API_KEY)
        data_tab = await funcProducts.getProductsByAxios(category_tab, API_KEY)
        data_pho = await funcProducts.getProductsByAxios(category_pho, API_KEY)
        console.log(data_lap.length)
        console.log(data_tab.length)
        console.log(data_pho.length)
        //save data in tasks
        let temp_lap = JSON.stringify(data_lap)
        fs.writeFile(__dirname + "/../tasks/laptops.json", temp_lap, function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
        let temp_tab = JSON.stringify(data_tab)
        //console.log(temp)
        fs.writeFile(__dirname + "/../tasks/tablets.json", temp_tab, function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
        let temp_pho = JSON.stringify(data_pho)
        //console.log(temp)
        fs.writeFile(__dirname + "/../tasks/phones.json", temp_pho, function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
    }
    console.log("addProductByAxios laptops")
    try {
        for (let i in data_lap) {
            console.log(await funcProducts.addProductByAxios(
                data_lap[i].sku,
                data_lap[i].name,
                data_lap[i].customerReviewAverage,
                data_lap[i].customerReviewCount,
                data_lap[i].manufacturer,
                data_lap[i].startDate,
                data_lap[i].regularPrice,
                data_lap[i].salePrice,
                data_lap[i].onSale,
                data_lap[i].url,
                data_lap[i].inStoreAvailability,
                data_lap[i].shortDescription,
                data_lap[i].longDescription,
                data_lap[i].largeFrontImage,
                data_lap[i].accessoriesImage,
                data_lap[i].alternateViewsImage,
                data_lap[i].angleImage,
                data_lap[i].backViewImage,
                data_lap[i].energyGuideImage,
                data_lap[i].image,
                data_lap[i].leftViewImage,
                data_lap[i].remoteControlImage,
                data_lap[i].rightViewImage,
                data_lap[i].topViewImage,
                data_lap[i].details,
                "laptops"
            ));
        }
    } catch (e) {
        console.log(e)
    }
    console.log("addProductByAxios tablets")
    try {
        for (let i in data_tab) {
            console.log(await funcProducts.addProductByAxios(
                data_tab[i].sku,
                data_tab[i].name,
                data_tab[i].customerReviewAverage,
                data_tab[i].customerReviewCount,
                data_tab[i].manufacturer,
                data_tab[i].startDate,
                data_tab[i].regularPrice,
                data_tab[i].salePrice,
                data_tab[i].onSale,
                data_tab[i].url,
                data_tab[i].inStoreAvailability,
                data_tab[i].shortDescription,
                data_tab[i].longDescription,
                data_tab[i].largeFrontImage,
                data_tab[i].accessoriesImage,
                data_tab[i].alternateViewsImage,
                data_tab[i].angleImage,
                data_tab[i].backViewImage,
                data_tab[i].energyGuideImage,
                data_tab[i].image,
                data_tab[i].leftViewImage,
                data_tab[i].remoteControlImage,
                data_tab[i].rightViewImage,
                data_tab[i].topViewImage,
                data_tab[i].details,
                "tablets"
            ));
        }
    }
    catch (e) {
        console.log(e)
    }
    console.log("addProductByAxios phones")
    try {
        for (let i in data_pho) {
            console.log(await funcProducts.addProductByAxios(
                data_pho[i].sku,
                data_pho[i].name,
                data_pho[i].customerReviewAverage,
                data_pho[i].customerReviewCount,
                data_pho[i].manufacturer,
                data_pho[i].startDate,
                data_pho[i].regularPrice,
                data_pho[i].salePrice,
                data_pho[i].onSale,
                data_pho[i].url,
                data_pho[i].inStoreAvailability,
                data_pho[i].shortDescription,
                data_pho[i].longDescription,
                data_pho[i].largeFrontImage,
                data_pho[i].accessoriesImage,
                data_pho[i].alternateViewsImage,
                data_pho[i].angleImage,
                data_pho[i].backViewImage,
                data_pho[i].energyGuideImage,
                data_pho[i].image,
                data_pho[i].leftViewImage,
                data_pho[i].remoteControlImage,
                data_pho[i].rightViewImage,
                data_pho[i].topViewImage,
                data_pho[i].details,
                "phones"
            ));
        }
    } catch (e) {
        console.log(e)
    }

    //test cases
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
    //addProduct 1111111 (error)
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
        console.log(await funcProducts.getProductsByID(1111111));
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
        console.log(await funcProducts.removeProduct(1111111));
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
    console.log("compareProducts(111111, 6447818, 6502184)")
    try {
        console.log(await funcProducts.compareProducts(1111111, 6447818, 6502184));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getProductsByManufacturer(HP)")
    try {
        console.log(await funcProducts.getProductsByManufacturer("HP"));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getManufacturersOfProducts()")
    try {
        console.log(await funcProducts.getManufacturersOfProducts());
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getProductByName(HP)")
    try {
        console.log(await funcProducts.getProductByName("HP"));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getProductsByCategory(laptops)")
    try {
        console.log(await funcProducts.getProductsByCategory("laptops"));
    } catch (e) {
        console.log(e)
    }
    console.log()
    console.log("getProductsByCategoryAndManufacturer(laptops, manufacturer)")
    try {
        console.log(await funcProducts.getProductsByCategoryAndManufacturer("laptops", "Acer"));
    } catch (e) {
        console.log(e)
    }
    console.log('Done!');
    await dbConnection.closeConnection();
};

main()