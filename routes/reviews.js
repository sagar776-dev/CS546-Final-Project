const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.products;
// const validation = require('../helpers');
const path = require('path');
const qna = data.qna;


router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = helpers.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }
    try {
      const review = await reviewsData.getAllReviews(req.params.id);
      if (review.length === 0)
        res.status(404).json({ error: 'no reviews for this movie' });
      else
        res.json(review);
    } catch (e) {
      res.status(404).json({ error: e.message, e });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    // try {
    //   req.params.id = helpers.checkId(req.params.id, 'Id URL Param');
    // } catch (e) {
    //   return res.status(400).json({ error: e.message, e });
    // }
    const reviewData = req.body;
    // try {
    //   helpers.validateReview(req.params.id, reviewData.reviewTitle, reviewData.reviewerName, reviewData.review, reviewData.rating);
    // } catch (e) {
    //   return res.status(400).json({ error: e.message, e });
    // }

    // try {
    //   const {
    //     reviewTitle,
    //     reviewerName,
    //     review,
    //     rating } = reviewData;
    try{
    let a = await qna.createQuestion('6447818','naveen','how to do this?');
      //const movie = await moviesData.getMovieById(req.params.id);
      res.json(a);
    } catch (e) {
      res.status(500).json({ error: e.message, e, e });
    }
  });

// router
//     .route('/')
//     .get(async (req, res) => {

//     })
//     .post(async (req, res) => {

//     })

module.exports = router;