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
            //   const qnas = await qnaData.getAllQna(req.params.id);
            //   if (qnas.length === 0)
            //     res.status(404).json({ error: 'no qnas for this product' });
            //   else
            //     res.json(qna);
            res.render("qna/addqna", { _id: req.params.id });
        } catch (e) {
            res.status(404).json({ error: e.message, e });
        }
    })
    .post(async (req, res) => {
        //code here for POST
        const params = new URLSearchParams(req.params.id);
        let product_id = params.get('product_id'); // 6507126
        let product_category = params.get('product_category'); // laptops
        try {
            product_id = helpers.validateId(product_id, 'Id URL Param');
        } catch (e) {
            return res.status(400).json({ error: e.message, e });
        }
        let question = req.body.question;
        try {
            question = helpers.validateQuestion(question, 'Question');
        } catch (e) {
            return res.status(400).json({ error: e.message, e });
        }

        try {
            const newQuestion = await qnaData.createQuestion(product_id, 'naveen', question);
            // let product = awproductData.getProductsByID(product_id);
            // let category = product.category;
            res.redirect('/api/products/' + product_category + '/' + product_id);
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
        //   const qnas = await qnaData.getAllQna(req.params.id);
        //   if (qnas.length === 0)
        //     res.status(404).json({ error: 'no qnas for this product' });
        //   else
        //     res.json(qna);
        res.render("qna/addAnswer", { _id: req.params.id });
    } catch (e) {
        res.status(404).json({ error: e.message, e });
    }
})
.post(async (req, res) => {
    //code here for POST
    const params = new URLSearchParams(req.params.id);
    let question_id = params.get('question_id');
    try {
        question_id = helpers.validateId(question_id, 'Id URL Param');
    } catch (e) {
        return res.status(400).json({ error: e.message, e });
    }
    let answer = req.body.answer;
    try {
        answer = helpers.validateQuestion(answer, 'answer');
    } catch (e) {
        return res.status(400).json({ error: e.message, e });
    }

    try {
        const newAnswer = await qnaData.addAnswer(question_id, 'naveen', answer);
        let product_id = newAnswer;
        let product = await productData.getProductsByID(product_id);
        let product_category = product.category;
        res.redirect('/api/products/' + product_category + '/' + product_id);
    } catch (e) {
        res.status(500).json({ error: e.message, e, e });
    }
});

module.exports = router;