const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

let exportedMethods = {
    async getAllProducts() {
        const productCollection = await products();
        const productList = await productCollection.find({}).toArray();
        if (!productList) throw 'No product in system!';
        return productList;
    },
    async addProduct(
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
            shortDescription,
            longDescription,
            pictures,
            details,
            reviews
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getUserById(newInsertInformation.insertedId.toString());
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
    }
}

module.exports = exportedMethods;