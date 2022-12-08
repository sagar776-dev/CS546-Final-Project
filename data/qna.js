const mongoCollections = require('../config/mongoCollections');
const productData = require('./products');
const helper = ('../helper/userValidation.js');
const validation = require('../validation');
//const { ObjectId } = require('mongodb');

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
    product_id = validation.checkId(id, "product ID");
    question = validation.checkQuestion(question);
    username = helper.validateUsername(username);

    let newQuestion = {
        id,
        username,
        question,
        date
    };



    //newQuestion.id = mongo.ObjectId();
    newQuestion.question = question;
    newQuestion.username = username;
    newQuestion.date = getDate();

    const productCollections = await mongoCollections.products();
    let insertInfo = await productCollections.updateOne({
        "_id": mongo.ObjectId(product_id)
    },
        {
            "$push": {
                "qna": {
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

const addAnswer = async (product_id, question_id, username, answer) => {
    answer = validation.checkQuestion(answer);
    username = helper.validateUsername(username);
    questionID = validation.checkId(question_id);
    questionID = validation.checkId(product_id);


    let newAnswer = {
        author,
        answer,
        date
    };

    newAnswer.answer = answer;
    newAnswer.author = username;
    newAnswer.date = getDate();
    
    const productCollections = await mongoCollections.products();

    let insertInfo = await productCollections.updateOne(
        {
            "_id": mongo.ObjectId(product_id),
            "qna._id": mongo.ObjectId(question_id)
        },
        {
            "$set": {
                "qna.$.answer": {
                    "answer": newAnswer.answer,
                    "author": newAnswer.author,
                    "date": newAnswer.date
                }
            }
        }
    )

    if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
        throw 'Could not add answer to question';
    return newAnswer;
};

const getQna = async (product_id)=>{
    try{
        let product = await productData.getProductsByID(product_id);
        let qna = product.qna;
        return qna;
    }
    catch(e){
        console.log(e);
    }
}


module.exports = {
    createQuestion,
    addAnswer,
    getQna
};
