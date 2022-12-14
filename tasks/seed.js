const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const funcProducts = data.products;
const userData = data.users;
const reviewsData = data.reviews;
const qnaData = data.qna;
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
            let a = await reviewsData.createReview(
                `${data_lap[i].sku}`,
                "Great Laptop",
                "Bob",
                "One of the Best Laptop",
                5
            )
        }
        console.log("here")
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
            let a = await reviewsData.createReview(
                `${data_tab[i].sku}`,
                "Great Tablets",
                "Bob",
                "One of the Best Tablets",
                5
            )
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
            let a = await reviewsData.createReview(
                `${data_pho[i].sku}`,
                "Great Phones",
                "Bob",
                "One of the Best Phones",
                5
            )
        }
    } catch (e) {
        console.log(e)
    }

    // //test cases
    // //addProduct 1111111
    // console.log()
    // console.log("addProduct")
    // try {
    //     //sku,name,manufacturer,startDate,price,url,inStoreAvailability,Description,pictures,details,category
    //     console.log(await funcProducts.addProduct(
    //         1111111,
    //         "Yes",
    //         "Yes manufacturer",
    //         "Yes startDate",
    //         "Yes price",
    //         "Yes url",
    //         "Yes inStoreAvailability",
    //         "Yes Description",
    //         "Yes pictures",
    //         "Yes details",
    //         "laptop"
    //     ));
    // } catch (e) {
    //     console.log(e)
    // }
    // //addProduct 1111111 (error)
    // console.log()
    // console.log("addProduct")
    // try {
    //     //sku,name,manufacturer,startDate,price,url,inStoreAvailability,Description,pictures,details,category
    //     console.log(await funcProducts.addProduct(
    //         1111111,
    //         "Yes",
    //         "Yes manufacturer",
    //         "Yes startDate",
    //         "Yes price",
    //         "Yes url",
    //         "Yes inStoreAvailability",
    //         "Yes Description",
    //         "Yes pictures",
    //         "Yes details",
    //         "laptop"
    //     ));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getProductsByID")
    // try {
    //     console.log(await funcProducts.getProductsByID(1111111));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getProductsByManufacturer")
    // try {
    //     await funcProducts.getProductsByManufacturer("Acer");
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getAllProducts")
    // try {
    //     await funcProducts.getAllProducts();
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("updateProduct")
    // try {
    //     // sku,name, manufacturer,startDate,price,url,inStoreAvailability,Description,pictures,details
    //     console.log(await funcProducts.updateProduct(
    //         111111,
    //         "Best",
    //         "Markovka",
    //         "20-29-2022",
    //         1234.99,
    //         "utl",
    //         true,
    //         "Description",
    //         [1, 2, 3],
    //         [{ "0": 0 }, { "1": 1 }, { "2": 2 }]));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("removeProduct")
    // try {
    //     // sku,name, manufacturer,startDate,price,url,inStoreAvailability,Description,pictures,details
    //     console.log(await funcProducts.removeProduct(1111111));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("compareProducts(111111)")
    // try {
    //     console.log(await funcProducts.compareProducts(1111111));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("compareProducts(111111, 6447818, 6502184)")
    // try {
    //     console.log(await funcProducts.compareProducts(1111111, 6447818, 6502184));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getProductsByManufacturer(HP)")
    // try {
    //     console.log(await funcProducts.getProductsByManufacturer("HP"));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getManufacturersOfProducts()")
    // try {
    //     console.log(await funcProducts.getManufacturersOfProducts());
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getProductByName(HP)")
    // try {
    //     console.log(await funcProducts.getProductByName("HP"));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getProductsByCategory(laptops)")
    // try {
    //     console.log(await funcProducts.getProductsByCategory("laptops"));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("getProductsByCategoryAndManufacturer(laptops, manufacturer)")
    // try {
    //     console.log(await funcProducts.getProductsByCategoryAndManufacturer("laptops", "Acer"));
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("compareLaptops(productsListSKU)")
    // let compare = 0;
    // try {
    //     compare = await funcProducts.compareLaptops([6447818, 6518252, 6477889, 6502230, 6509654])
    //     console.log(compare[0]);
    //     console.log(compare[1]);
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("different products compareLaptops(productsListSKU)")
    // compare = 0;
    // try {
    //     compare = await funcProducts.compareLaptops([6447818, 6477100, 6477093, 6502230, 6487439]);
    //     console.log(compare[0]);
    //     console.log(compare[1]);
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("comparePhones(productsListSKU)")
    // compare = 0;
    // try {
    //     compare = await funcProducts.comparePhones([6487439, 6487254, 6468291, 6520023, 6487356]);
    //     console.log(compare[0]);
    //     console.log(compare[1]);
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("different products comparePhones(productsListSKU)")
    // compare = 0;
    // try {
    //     compare = await funcProducts.comparePhones([6447818, 6477100, 6477093, 6502230, 6487439]);
    //     console.log(compare[0]);
    //     console.log(compare[1]);
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("compareTablets(productsListSKU)")
    // compare = 0;
    // try {
    //     compare = await funcProducts.compareTablets([6517642, 6492318, 6340608, 4263701, 6461942]);
    //     console.log(compare[0]);
    //     console.log(compare[1]);
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log()
    // console.log("different products compareTablets(productsListSKU)")
    // compare = 0;
    // try {
    //     compare = await funcProducts.compareTablets([6461942, null, 6477093, 6340498, 6487439]);
    //     console.log(compare[0]);
    //     console.log(compare[1]);
    // } catch (e) {
    //     console.log(e)
    // }

    // console.log('Products Done!');


    let users = [
        {
            "username": "johndoe",
            "password": "Test.1234",
            "firstName": "John",
            "lastName": "Doe",
            "email": "johndoe@gmail.com",
            "gender": "man",
            "userType": "user",
            "history": [
                6447818,
                6478315,
                6507126,
                6443068,
                6443398,
                6443288,
                6518252,
                6443179,
                6443399,
                6461943,
                6461925
            ],
            "wishlist": [
                6478315,
                6507126,
                6443179,
                6447818
            ],
            "dislikedReviews": [],
            "likedReviews": []
        },
        {
            "username": "admin123",
            "password": "Admin.123",
            "firstName": "Admin",
            "lastName": "User",
            "email": "admin@gmail.com",
            "gender": "man",
            "userType": "admin",
            "wishlist": [],
            "history": [],
            "likedReviews": [],
            "dislikedReviews": []
        }
    ]

    for (let user of users) {
        await userData.seedUser(user);
    }
    console.log("Users done");
    await dbConnection.closeConnection();
};

main()