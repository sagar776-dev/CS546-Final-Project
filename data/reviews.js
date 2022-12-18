const mongoCollections = require('../config/mongoCollections');
const productData = require('./products');
const helpers = require('../helper/userValidation.js');
const validation = require('../validation');
//const { ObjectId } = require('mongodb');
const mongo = require('mongodb');
const products = mongoCollections.products;


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


const likeReview = async (review_id) => {
  try {
    review_id = helpers.validateId(review_id, "review id");
  } catch (e) {
    throw e;
  }
  let product_id = null;

  const productCollections = await mongoCollections.products()
  let product = await productCollections.find({ "reviews._id": mongo.ObjectId(review_id) }).toArray()
  if (!product) throw 'Product not found';
  product_id = product[0]._id

  let insertInfo = await productCollections.updateOne(
    { _id: product_id, "reviews._id": mongo.ObjectId(review_id) },
    { $inc: { "reviews.$.like": 1 } }
  );
  if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
    throw 'Could not add like';
  let latestLikeCount;
  if (insertInfo.modifiedCount > 0) {
    // If the update was successful, retrieve the updated document and get the latest value of "like"
    let updatedProduct = await productCollections.findOne({ _id: product_id });
    updatedProduct.reviews.forEach((element)=>{
      if(element._id==review_id){
        latestLikeCount=element.like;
      }
    })
  } else {
    // If the update was not successful
    latestLikeCount = 0;
  }

  return latestLikeCount;
}

const dislikeReview = async (review_id) => {
  try {
    review_id = helpers.validateId(review_id, "review id");
  } catch (e) {
    throw e;
  }
  let product_id = null;

  const productCollections = await mongoCollections.products()
  let product = await productCollections.find({ "reviews._id": mongo.ObjectId(review_id) }).toArray()
  if (!product) throw 'Product not found';
  product_id = product[0]._id

  let insertInfo = await productCollections.updateOne(
    { _id: product_id, "reviews._id": mongo.ObjectId(review_id) },
    { $inc: { "reviews.$.dislike": 1 } }
  );
  if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
    throw 'Could not add dislike';
  let latestdisLikeCount;
  if (insertInfo.modifiedCount > 0) {
    // If the update was successful, retrieve the updated document and get the latest value of "like"
    let updatedProduct = await productCollections.findOne({ _id: product_id });
    updatedProduct.reviews.forEach((element)=>{
      if(element._id==review_id){
        latestdisLikeCount=element.dislike;
      }
    })
  } else {
    // If the update was not successful
    latestdisLikeCount = 0;
  }

  return latestdisLikeCount;
}

const createReview = async (
  product_id,
  reviewTitle,
  reviewerName,
  review,
  rating,
  //pictures
) => {
  // Validate input fields
  try {
    product_id = helpers.validateId(product_id, "Product ID");
    reviewTitle = helpers.validateQuestion(reviewTitle, "reviewTitle");
    reviewerName = helpers.validateQuestion(reviewerName, "reviewer Name");
    review = helpers.validateQuestion(review, "review");
  } catch (e) {
    throw e;
  }

  // Set default value for pictures if not provided
  // if (!pictures) {
  //   pictures = [];
  // }

  // Create new review object
  let newReview = {
    _id: mongo.ObjectId(),
    reviewTitle,
    reviewerName,
    review,
    rating
    //pictures,
  };

  // Add review date
  newReview.reviewDate = getDate();
  newReview.like = 0;
  newReview.dislike = 0;
  // Update product with new review
  const productCollection = await products();
  let insertInfo = await productCollection.updateOne(
    {
      _id: parseInt(product_id),
    },
    {
      $push: {
        reviews: {
          _id: mongo.ObjectId(newReview._id),
          reviewTitle: newReview.reviewTitle,
          reviewDate: newReview.reviewDate,
          reviewerName: newReview.reviewerName,
          review: newReview.review,
          rating: newReview.rating,
          //pictures: newReview.pictures,
          like:newReview.like,
          dislike:newReview.like
        },
      },
    }
  );
  if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
    throw "Could not add review to product";

  // Calculate and update overall rating for product
  let newOverallRating = await calculateOverallRating(product_id);
  insertInfo = await productCollection.updateOne(
    { _id: parseInt(product_id) },
    { $set: { overallRating: newOverallRating } }
  );
  if (!insertInfo.acknowledged) throw "Could not update overallRating to product";

  return newReview;
};

const getAllReviews = async (product_id) => {
  let id = helpers.checkId(product_id, "Product Id");
  let product = await productData.getProductsByID(id);
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


const calculateOverallRating = async (product_id) => {
  let product = await productData.getProductsByID(parseInt(product_id));
  let average = 0;
  let sum = 0;
  let count = 0
  product.reviews.forEach(element => {
    sum = sum + parseInt(element.rating);
    count = count + 1;
  });
  if (count === 0) return 0;
  average = sum / count;
  average = Math.round(average * 10) / 10
  return average;
}

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview,
  likeReview,
  dislikeReview
};
