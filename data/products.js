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
        name,
        category,
        description,
        price,
        release_date,
        picture,
        amazonurl,
        bestbuyurl) {
        //validation start
        name = name;
        category = category;
        picture = picture;
        amazonurl = amazonurl;
        bestbuyurl = bestbuyurl;
        //validation end 

        const productCollection = await products();

        //unknown parameters
        specifications = [];
        reviews = [];
        qna = [];
        comments = [];
        rating = 0;

        let newProduct = {
            name: name,
            category: category,
            description: description,
            price: price,

            specifications: specifications,
            rating: rating,
            release_date: release_date,
            reviews: reviews,
            qna: qna,

            comments: comments,
            picture: picture,
            amazonurl: amazonurl,
            bestbuyurl: bestbuyurl
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
        productId,
        name,
        category,
        description,
        price,
        release_date,
        picture,
        amazonurl,
        bestbuyurl) {

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