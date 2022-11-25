const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;

const axios = require('axios');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const validation = require('../validation');

let exportedMethods = {
    async getAllProducts() {
        const productCollection = await products();
        const productList = await productCollection.find({}).toArray();
        if (!productList) throw 'No product in system!';
        return productList;
    },
    async addProductByAxios(
        sku,
        name,
        customerReviewAverage,
        customerReviewCount,
        manufacturer,
        startDate,
        regularPrice,
        salePrice,
        onSale,
        url,
        inStoreAvailability,
        shortDescription,
        longDescription,
        image,
        largeFrontImage,
        mediumImage,
        thumbnailImage,
        angleImage,
        backViewImage,
        details
    ) {
        //validation start
        sku = sku; // length 7 all numbers
        name = name; // Name
        customerReviewAverage = customerReviewAverage; // 4.56
        customerReviewCount = customerReviewCount; // 6 full integer
        manufacturer = manufacturer; // manufacturer
        startDate = startDate;  // format 2022-04-06
        regularPrice = regularPrice; // format 1499.00
        salePrice = salePrice; // format 1499.00
        onSale = onSale; //True or False
        url = url; //Check if url is valid
        inStoreAvailability = inStoreAvailability; //True or False
        shortDescription = shortDescription; // Description if null
        longDescription = longDescription; // Description if null
        image = image; // if null dont show
        largeFrontImage = largeFrontImage; // if null remove
        mediumImage = mediumImage; // if null remove
        thumbnailImage = thumbnailImage; // if null remove
        angleImage = angleImage; // if null remove
        backViewImage = backViewImage; // if null remove
        details = details; // array with objects
        //validation end 
        // fixes start
        //static
        reviews = []
        //price 
        if (onSale) {
            price = salePrice;
        } else {
            price = regularPrice;
        }
        //pictures
        pictures = [image, largeFrontImage, mediumImage, thumbnailImage, angleImage, backViewImage]
        for (let i = 0; i < pictures.length; i++) {
            if (pictures[i] === null) {
                pictures.splice(i, 1);
                i--;
            }
        }
        //Description
        if (shortDescription === null) {
            Description = longDescription
        } else {
            Description = shortDescription
        }
        // fixes end
        const productCollection = await products();
        let newProduct = {
            sku,
            name,
            customerReviewAverage,
            customerReviewCount,
            manufacturer,
            startDate,
            price,
            url,
            inStoreAvailability,
            Description,
            pictures,
            details,
            reviews
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getProductsByID(newInsertInformation.insertedId.toString());
    },
    async addProduct(
        sku,
        name,
        manufacturer,
        startDate,
        price,
        url,
        inStoreAvailability,
        Description,
        pictures,
        details,
    ) {
        //validation start
        sku = sku; // length 7 all numbers
        name = name; // Name
        manufacturer = manufacturer; // manufacturer
        startDate = startDate;  // format 2022-04-06   
        price = price // format 1399.00
        url = url; //Check if url is valid
        inStoreAvailability = inStoreAvailability; //True or False
        Description = Description; // Description if null
        pictures = pictures; // if null dont show
        details = details; // array with objects
        //validation end
        //static
        customerReviewAverage = 0
        customerReviewCount = 0
        reviews = []
        pictures = []
        const productCollection = await products();

        let newProduct = {
            sku,
            name,
            customerReviewAverage,
            customerReviewCount,
            manufacturer,
            startDate,
            price,
            url,
            inStoreAvailability,
            Description,
            pictures,
            details,
            reviews
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getProductsByID(newInsertInformation.insertedId.toString());
    },
    async getProductsByID(productId) {
        //validation start
        productId = productId
        //validation end
        const productCollection = await products();
        const product = await productCollection.findOne({ _id: ObjectId(productId) });
        if (!product) throw 'Product not found';
        return product;
    },
    async getProductsByName() {
    },
    async getProducts() {
    },
    async updateProduct(
        sku,
        name,
        customerReviewAverage,
        customerReviewCount,
        manufacturer,
        startDate,
        regularPrice,
        salePrice,
        onSale,
        url,
        inStoreAvailability,
        shortDescription,
        longDescription,
        image,
        largeFrontImage,
        mediumImage,
        thumbnailImage,
        angleImage,
        backViewImage,
        details) {


    },
    async removeProduct(productId) {
        //validation start
        productId = productId;
        //validation end
        const productCollection = await products();
        const product = await productCollection.findOne({ _id: ObjectId(productId) });
        const deletionInfo = await productCollection.deleteOne({ _id: ObjectId(productId) });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete product with id of ${productId}`;
        }
        return `${product["name"]} has been successfully deleted!`;
    },
    async getProductsByAxios(API_KEY) {
        const { data } = await axios.get(`https://api.bestbuy.com/v1/products((categoryPath.id=abcat0502000))?apiKey=${API_KEY}&sort=name.asc&show=sku,name,customerReviewAverage,customerReviewCount,color,manufacturer,startDate,regularPrice,salePrice,onSale,url,inStoreAvailability,shortDescription,longDescription,image,largeFrontImage,mediumImage,thumbnailImage,angleImage,backViewImage,details.name&facet=regularPrice&pageSize=10&format=json`)
            .catch((e) => {
                throw 'URL is not found';
            });
        return data.products; // this will be the array of people objects
    }

}

module.exports = exportedMethods;
