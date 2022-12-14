const express = require('express');
const router = express.Router();
const data = require('../data');
const helpers = require('../helper/userValidation');
const qnaData = data.qna;
const productData = data.products;
const xss = require("xss");


router
    .route('/:id')
    .get(async (req, res) => {
        //code here for GET
        try {
            req.params.id = helpers.validateId(xss(req.params.id), 'Id URL Param');
        } catch (e) {
            return res.status(400).json({ error: e.message, e });
        }
        try {
            res.render("qna/addQuestion", { _id: req.params.id });
        } catch (e) {
            res.status(404).json({ error: e.message });
        }
    })
    .post(async (req, res) => {
        //code here for POST
        let product_id = xss(req.body.product_id);
        let question = xss(req.body.question);
        try {
            product_id = helpers.validateId(product_id, 'Id URL Param');
        } catch (e) {
            return res.status(200).json({ error: e.message });
        }
        try {
            question = helpers.validateQuestion(question, 'Question');
        } catch (e) {
            return res.status(200).json({ error: e.message });
        }
        try {
            const newQuestion = await qnaData.createQuestion(product_id, req.session.username, question);
            let product = await productData.getProductsByID(parseInt(product_id));
            let product_category = product.category;
            return res.json({product_category:product_category, product_id:req.params.id})
        } catch (e) {
            res.status(200).json({ error: e.message });
        }
    });



    
router
.route('/answer/:id')
.get(async (req, res) => {
    //code here for GET
    try {
        req.params.id = helpers.validateId(xss(req.params.id), 'Id URL Param');
    } catch (e) {
        return res.status(400).json({ error: e.message, e });
    }
    try {
        res.render("qna/addAnswer", { _id: req.params.id });
    } catch (e) {
        res.status(404).json({ error: e.message, e });
    }
})
.post(async (req, res) => {
    //code here for POST
    let question_id = xss(req.body.question_id);
    let answer = xss(req.body.answer);
    try {
        question_id = helpers.validateId(question_id, 'Id URL Param');
    } catch (e) {
        return res.status(200).json({ error: e.message });
    }
    try {
        answer = helpers.validateQuestion(answer, 'answer');
    } catch (e) {
        return res.status(200).json({ error: e.message });
    }

    try {
        const newAnswer = await qnaData.addAnswer(question_id, req.session.username, answer);
        let product_id = newAnswer;
        let product = await productData.getProductsByID(parseInt(product_id));
        let product_category = product.category;
        return res.json({product_category:product_category, product_id:product_id})
    } catch (e) {
        res.status(200).json({ error: e.message});
    }
});

module.exports = router;