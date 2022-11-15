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
    async addProduct(name, category, description, price, release_date, picture, amazonurl, bestbuyurl) {
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
            specifications: specifications,
            description: description,
            price: price,
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
    async getProductsByID() {

    },
    async getProductsByName() {

    },
    async getProducts() {

    },
    async updateProduct() {

    },
    async removeProduct() {

    }
}

module.exports = exportedMethods;