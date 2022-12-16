const express = require("express");
const router = express.Router();
const data = require("../data");
// const productData = data.products;
const userData = data.users;
const productData = data.products;
const userValidate = require("../helper/userValidation");
const xss = require('xss');

router
  .route("/signup")
  .get(async (req, res) => {
    res.render("users/signup");
  })
  .post(async (req, res) => {
    try {
      console.log("Signup route");
      let user = req.body;
      user.username = userValidate.validateUsername(user.username);
      user.firstName = userValidate.validateName(user.firstName, "First name");
      user.lastName = userValidate.validateName(user.lastName, "Last name");
      user.gender = userValidate.validateGender(user.gender);
      user.email = userValidate.validateEmail(user.email);
      user.password = userValidate.validatePassword(user.password);
      await userData.registerUser(user);
      res.statusCode(200).json({ message: "User registered" });
    } catch (e) {
      console.log(e);
      res.json({ error: e });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.username) {
      res.redirect("/api");
      return;
    } else {
      res.render("users/login");
    }
  })
  .post(async (req, res) => {
    console.log("Signin route");
    try {
      let user = req.body;
      user.username = userValidate.validateUsername(user.username);
      user.password = userValidate.validatePassword(user.password);
      let response = await userData.checkUser(user.username, user.password);
      req.session.username = user.username;
      //res.json({ message: "Logged in" });
      res.json(response);
      return;
    } catch (e) {
      console.log(e);
      // res.render("users/login", { error: e });
      res.json({ error: e });
      return;
    }
  });

router.route("/userProfile").get(async (req, res) => {
  //code here for GET
  let username = req.session.username;
  if (!username) {
    res.redirect("/");
    return;
  }
  try {
    username = userValidate.validateUsername(username);
  } catch (e) {
    return res.status(400).json({ error: e.message, e });
  }
  try {
    const user = await userData.userProfile(username);
    if (!user) res.status(404).json({ error: "user doesn't exist" });
    else res.json(user);
  } catch (e) {
    res.status(404).json({ error: e.message, e });
  }
});

router.route("/wishlist").get(async (req, res) => {
  //code here for GET
  let username = req.session.username;
  try {
    username = userValidate.validateUsername(username);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    const wishlist = await userData.getWishlistForUser(username);
    if (!wishlist)
      res.render("users/wishlist", {
        error: "No products in your wishlist",
      });
    else
      res.render("users/wishlist", {
        wishlistProducts: wishlist,
      });
    return;
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
})

router.route("/addwishlist/:id").get(async (req, res) => {
  //code here for GET
  let username = req.session.username;
  let sku = req.params.id;
  let product;
  try {
    username = userValidate.validateUsername(username);
    if(!sku) throw "Product ID not valid";
    sku = Number(sku);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    let updatedWishlist = await userData.addProductToWishlist(sku, username);
    product = await productData.getProductsByID(sku);
    console.log(product);
    return res.redirect("/api/products/"+product.category+"/"+product._id);
  } catch (e) {
    console.log(e);
    return res.redirect("/api/products/"+product.category+"/"+product._id);
  }
})

router.route("/removewishlist/:id").get(async (req, res) => {
  //code here for GET
  let username = req.session.username;
  let sku = req.params.id;
  let product;
  try {
    username = userValidate.validateUsername(username);
    if(!sku) throw "Product ID not valid";
    sku = Number(sku);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    let updatedWishlist = await userData.removeProductFromWishlist(sku, username);
    product = await productData.getProductsByID(sku);
    console.log(product);
    return res.redirect("/api/products/"+product.category+"/"+product._id);
  } catch (e) {
    console.log(e);
    return res.redirect("/api/products/"+product.category+"/"+product._id);
  }
})

router.route("/viewhistory").get(async (req, res) => {
  //code here for GET
  let username = req.session.username;
  try {
    username = userValidate.validateUsername(username);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    const history = await userData.getHistoryForUser(username);
    if (!history)
      res.render("users/viewHistory", {
        error: "Your view history is empty",
      });
    else
      res.render("users/viewHistory", {
        historyProducts: history,
      });
    return;
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e.message });
  }
});

module.exports = router;
