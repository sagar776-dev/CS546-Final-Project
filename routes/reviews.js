const express = require('express');
const router = express.Router();
const data = require('../data');
const helpers = require('../helper/userValidation');
const reviewData = data.reviews;
const productData = data.products;
//const multer = require("multer");

// const imageFilter = function (req, file, cb) {
//   // Accept images only
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//     return cb(new Error("Only image files are allowed!"), false);
//   }
//   cb(null, true);
// };

// const upload = multer({ dest: "uploads/", fileFilter: imageFilter });

router
  .route('/:id/like')
  .post(async (req, res) => {
    try {
      req.params.id = helpers.validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }
    try {
      let a = await reviewData.likeReview(req.params.id, req.session.username);
      res.status(200).json({likeCount: a});
    } catch (e) {
      res.status(500).json({ error: e.message, e, e });
    }
  });

router
  .route('/:id/dislike')
  .post(async (req, res) => {
    try {
      req.params.id = helpers.validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }
    try {
      let a = await reviewData.dislikeReview(req.params.id, req.session.username);
      res.status(200).json({dislikeCount: a});

    } catch (e) {
      res.status(500).json({ error: e.message, e, e });
    }
  });

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
      res.render("reviews/addReview", { _id: req.params.id });
    } catch (e) {
      res.status(404).json({ error: e.message, e });
    }
  })
  .post(//upload.single("reviewPhoto"),
   async (req, res) => {
    //code here for POST
    var reviewTitle = req.body.reviewTitle;
    var reviewText = req.body.reviewText;
    //var reviewPhoto = req.file;
    var rating = req.body.rating;
    try {
      req.params.id = helpers.validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }
    try {
      reviewTitle = helpers.validateQuestion(reviewTitle, 'review Title');
      reviewText = helpers.validateQuestion(reviewText, 'review Text');
    } catch (e) {
      return res.status(400).json({ error: e.message, e });
    }
    try {
      const newReview = await reviewData.createReview(req.params.id, reviewTitle, 'naveen', reviewText, rating); //reviewPhoto);
      let product = await productData.getProductsByID(parseInt(req.params.id));
      let product_category = product.category;
      return res.json({product_category:product_category, product_id:req.params.id})
      
      //res.redirect('/api/products/' + product_category + '/' + req.params.id);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message, e, e });
    }

  });

module.exports = router;