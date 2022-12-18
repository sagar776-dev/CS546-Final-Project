const mongoCollections = require('../config/mongoCollections');
const productData = require('./products');
const helpers = require('../helper/userValidation.js');
// const { ObjectId } = require('mongodb');
const mongo = require('mongodb');

const getDate = () => {
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    month = month + 1;
    if (month < 10)
        month = '0' + month;
    if (day < 10)
        day = '0' + day;
    let dateFormat = month + '/' + day + '/' + year;
    return dateFormat;
}

const createQuestion = async (
    product_id,
    username,
    question
) => {
    //product_id = validation.checkId(product_id, "product ID");
    question = helpers.validateQuestion(question, 'Question ');
    //username = helper.validateUsername(username);

    let newQuestion = {
        username,
        question
    };
    newQuestion._id = mongo.ObjectId();
    newQuestion.question = question;
    newQuestion.username = username;
    newQuestion.date = getDate();

    const productCollections = await mongoCollections.products()

    let insertInfo = await productCollections.updateMany({
        "_id": parseInt(product_id)
    },
        {
            "$push": {
                "qna": {
                    "_id": mongo.ObjectId(newQuestion._id),
                    "question": newQuestion.question,
                    "username": newQuestion.username,
                    "date": newQuestion.date
                }
            }
        })
    if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
        throw 'Could not add question to product';
    return newQuestion;
};




const addAnswer = async (qnaId, username, answer) => {
    answer = helpers.validateQuestion(answer);
    username = helpers.validateUsername(username);
    qnaId = helpers.validateId(qnaId);
    let product_id = null;

    const productCollections = await mongoCollections.products()
    //console.log("Searching the product");
    let product = await productCollections.find({ "qna._id": mongo.ObjectId(qnaId) }).toArray()
    if (!product) throw 'Product not found';
    product_id = product[0]._id
    const answer1 = {
        answer: answer,
        author: username,
        date: getDate()
    };
    let insertInfo = await productCollections.updateOne(
        { _id: product_id, "qna._id": mongo.ObjectId(qnaId) },
        { $set: { "qna.$.answer": answer1 } }
    );
    if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
        throw 'Could not add answer to review';
    return product[0]._id;
}

const getAllQna = async (product_id) => {
    try {
        let product = await productData.getProductsByID(product_id);
        let qna = product.qna;
        return qna;
    }
    catch (e) {
        //console.log(e);
    }
}

//trial();
module.exports = {
    createQuestion,
    addAnswer,
    getAllQna
};
