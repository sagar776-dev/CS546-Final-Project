const mongoCollections = require('../config/mongoCollections');
const productData = require('./products');
const helpers = ('../helper/userValidation.js');
const validation = require('../validation');
//const { ObjectId } = require('mongodb');
const mongo = require('mongodb');
const products = mongoCollections.products;
// "_id": "7b696a2-d0f2-4g8g-h67d-7a1d4b6b8897",
// "title": "Terrific device",
// "author": "Anonymous1",
// "body": "Its one of the best devices from Apple",
// "pictures": [],
// "rating": 5,
// "likes": 1,
// "dislikes": 0,
// "comments": [
// {
// "author": "Anonymous2",
// "body": "Did you get a chance to check out the new camera sensor?"
// }
// ],
// "date": "11/01/2022"
const createReview = async (
  product_id,
  reviewTitle,
  reviewerName,
  review,
  rating,
  pictures
) => {

  helpers.validateReview(
    product_id,
  reviewTitle,
  reviewerName,
  review,
  rating,
  pictures
  );

  let newReview = {
    
  reviewTitle,
  reviewerName,
  review,
  rating,
  pictures
  };

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

  newReview._id = mongo.ObjectId();
  newReview.reviewTitle = reviewTitle;
  newReview.reviewDate = dateFormat;
  newReview.reviewerName = reviewerName;
  newReview.review = review;
  newReview.rating = rating;
  newReview.pictures = pictures;

  const productCollection = await products();
  let insertInfo = await productCollection.updateOne({
    "_id": mongo.ObjectId(product_id)
  },
    {
      "$push": {
        "reviews": {
          "_id": mongo.ObjectId(newReview._id),
          "reviewTitle": newReview.reviewTitle,
          "reviewDate": newReview.reviewDate,
          "reviewerName": newReview.reviewerName,
          "review": newReview.review,
          "rating": newReview.rating,
          "pictures": newReview.pictures
        }
      }
    })
  if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
    throw 'Could not add review to product';
  let newOverallRating = await calculateOverallRating(product_id)
  insertInfo = await productCollection.updateOne({ _id: mongo.ObjectId(product_id) }, { $set: { overallRating: newOverallRating } })
  if (!insertInfo.acknowledged)
    throw 'Could not update overallRating to product';
  return newReview;
};

const getAllReviews = async (product_id) => {
  let id = helpers.checkId(product_id, "Product Id");
  let product = await productData.getProductsByID(id)
  reviews = product.reviews;
  if (!reviews)
    return [];
  else
    return reviews;

};

const getReview = async (reviewId) => {
  reviewId = helpers.validateId(reviewId, "Review Id");
  let rev;
  let productArray = await productData.getAllProducts();
  productArray.forEach(element => {
    element.reviews.forEach(productReview => {
      if (productReview._id.toString() == reviewId)
        rev = productReview;
    })
  });
  return rev;
};

const removeReview = async (reviewId) => {
  reviewId = helpers.checkId(reviewId, "Review Id");
  let product_id;
  let rating;
  let productArray = await productData.getAllProducts();
  productArray.forEach(element => {
    element.reviews.forEach(productReview => {
      if (productReview._id.toString() == reviewId)
      product_id = element._id;
      rating = productReview.rating;
    })
  });
  if (!product_id) throw "product_id does not exist";
  getproduct = await productData.getProductsByID(product_id);
  const productCollection = await products();
  let insertInfo = await productCollection.updateOne({
    "_id": mongo.ObjectId(product_id),
  },
    {
      "$pull": {
        "reviews": {
          "_id": mongo.ObjectId(reviewId)
        }
      }
    });
  if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
    throw 'Could not remove review from Product';
  let newOverallRating = await calculateOverallRating(product_id)
  insertInfo = await productCollection.updateOne({ _id: mongo.ObjectId(product_id) }, { $set: { overallRating: newOverallRating } })
  if (!insertInfo.acknowledged)
    throw 'Could not update overallRating to Product';
  let a = await productData.getProductsByID(product_id);
  return a;
};


const calculateOverallRating = async (movieId) => {
  let product = await productData.getProductsByID(product_id);
  let average = 0;
  let sum = 0;
  let count = 0
  product.reviews.forEach(element => {
    sum = sum + element.rating;
    count = count + 1;
  });
  if(count===0) return 0;
  average = sum / count;
  average = Math.round(average * 10) / 10
  return average;
}
module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview
};
