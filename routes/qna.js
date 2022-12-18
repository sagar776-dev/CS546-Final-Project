const express = require('express');
const router = express.Router();
const data = require('../data');
const helpers = require('../helper/userValidation');
const qnaData = data.qna;
const productData = data.products;


router
    .route('/:id')
    .get(async (req, res) => {
        //code here for GET
        try {
            req.params.id = helpers.validateId(req.params.id, 'Id URL Param');
        } catch (e) {
            return res.status(400).json({ error: e.message, e });
        }
        try {
            res.render("qna/addQuestion", { _id: req.params.id });
        } catch (e) {
            res.status(404).json({ error: e.message, e });
        }
    })
    .post(async (req, res) => {
        //code here for POST
        let product_id = req.body.product_id;
        let question = req.body.question;
        try {
            product_id = helpers.validateId(product_id, 'Id URL Param');
        } catch (e) {
            return res.status(400).json({ error: e.message, e });
        }
        try {
            question = helpers.validateQuestion(question, 'Question');
        } catch (e) {
            return res.status(400).json({ error: e.message, e });
        }
        try {
            const newQuestion = await qnaData.createQuestion(product_id, 'naveen', question);
            let product = await productData.getProductsByID(parseInt(product_id));
            let product_category = product.category;
            return res.json({product_category:product_category, product_id:req.params.id})
        } catch (e) {
            res.status(500).json({ error: e.message, e, e });
        }
    });



    
router
.route('/answer/:id')
.get(async (req, res) => {
    //code here for GET
    try {
        req.params.id = helpers.validateId(req.params.id, 'Id URL Param');
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
    let question_id = req.body.question_id;
    let answer = req.body.answer;
    try {
        question_id = helpers.validateId(question_id, 'Id URL Param');
    } catch (e) {
        return res.status(400).json({ error: e.message, e });
    }
    try {
        answer = helpers.validateQuestion(answer, 'answer');
    } catch (e) {
        return res.status(400).json({ error: e.message, e });
    }

    try {
        const newAnswer = await qnaData.addAnswer(question_id, 'naveen', answer);
        let product_id = newAnswer;
        let product = await productData.getProductsByID(parseInt(product_id));
        let product_category = product.category;
        return res.json({product_category:product_category, product_id:product_id})
    } catch (e) {
        res.status(500).json({ error: e.message});
    }
});

module.exports = router;