const express = require('express');
const router = express.Router();
const data = require('../data');
const helpers = require('../helper/userValidation');
const reviewData = data.reviews;



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
    res.render("reviews/addReview",{_id: req.params.id});
    } catch (e) {
      res.status(404).json({ error: e.message, e });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      req.params.id = helpers.validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }
    let question = req.body;
    try {
        question = helpers.validateQuestion(question,'Question');
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }

    try {
      const newQuestion = await qnaData.createQuestion(req.params.id,'naveen',question);
      res.status(200).json({message: newQuestion});
    } catch (e) {
      res.status(500).json({ error: e.message, e, e });
    }
  });

  module.exports = router;