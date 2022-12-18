const express = require("express");
const router = express.Router();
const data = require("../data");
// const productData = data.products;
const userData = data.users;
const productData = data.products;
const userValidate = require("../helper/userValidation");
const xss = require("xss");

router
  .route("/signup")
  .get(async (req, res) => {
    if (req.session.username) {
      res.redirect("/api");
      return;
    }
    res.render("users/signup");
  })
  .post(async (req, res) => {
    try {
      console.log("Signup route");
      let user = req.body;
      user.username = userValidate.validateUsername(xss(user.username));
      user.firstName = userValidate.validateName(xss(user.firstName, "First name"));
      user.lastName = userValidate.validateName(xss(user.lastName, "Last name"));
      user.gender = userValidate.validateGender(xss(user.gender));
      user.email = userValidate.validateEmail(xss(user.email));
      user.password = userValidate.validatePassword(xss(user.password));
      await userData.registerUser(user);
      res.status(200).json({ message: "User registered" });
    } catch (e) {
      console.log(e);
      res.status(200).json({ error: e });
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
      //var html = xss('<script>alert("xss");</script>');
      let user = JSON.parse(xss(JSON.stringify(req.body)));
      console.log(user);
      user.username = userValidate.validateUsername(xss(user.username));
      user.password = userValidate.validatePassword(xss(user.password));
      let response = await userData.checkUser(user.username, user.password);
      req.session.username = user.username.toLowerCase();
      //res.json({ message: "Logged in" });
      res.status(200).json(response);
      return;
    } catch (e) {
      console.log(e);
      // res.render("users/login", { error: e });
      res.status(200).json({ error: e });
      return;
    }
  });

router.route("/logout").get(async (req, res) => {
  try {
    req.session.destroy();
    res.render("users/login");
  } catch (e) {
    res.render("users/login");
  }
});

router
  .route("/userProfile")
  .get(async (req, res) => {
    //code here for GET
    let username = "sagar776";
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
      const user = await userData.getUserProfile(username);
      if (!user) {
        return res.status(404).json({ error: "user doesn't exist" });
      } else {
        return res.status(200).json({ user: user });
      }
    } catch (e) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  })
  .post(async (req, res) => {
    try {
      let user = req.body;
      username = userValidate.validateUsername(xss(user.username));
      firstName = userValidate.validateName(xss(user.firstName), "First name");
      lastName = userValidate.validateName(xss(user.lastName), "Last name");
      gender = userValidate.validateGender(xss(user.gender));
      email = userValidate.validateEmail(xss(user.email));
      //password = userValidate.validatePassword(user.password);
      if (user.newPassword.length !== 0) {
        currentPassword = userValidate.validatePassword(xss(user.currentPassword));
        newPassword = userValidate.validatePassword(xss(user.newPassword));
      }

      let result = await userData.updateProfile(user);

      res.status(200).json({message: "Profile updated"});
    } catch (e) {
      console.log(e);
      res.status(500).json({error: e.message});
    }
  });

router.route("/wishlist").get(async (req, res) => {
  //code here for GET
  let username = xss(req.session.username);
  try {
    username = userValidate.validateUsername(username);
  } catch (e) {
    console.log(e);
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
    console.log(e);
    res.render("users/wishlist", {
      error: "No products in your wishlist",
    });
  }
});

router.route("/addwishlist/:id").get(async (req, res) => {
  //code here for GET
  let username = xss(req.session.username);
  let sku = xss(req.params.id);
  let product;
  try {
    username = userValidate.validateUsername(username);
    if (!sku) throw "Product ID not valid";
    sku = Number(sku);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    let updatedWishlist = await userData.addProductToWishlist(sku, username);
    product = await productData.getProductsByID(sku);
    console.log(product);
    return res.status(200).json({ message: "Product added to your wishlist" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Error while adding product to wishlist" });
  }
});

router.route("/removewishlist/:id").get(async (req, res) => {
  //code here for GET
  let username = xss(req.session.username);
  let sku = xss(req.params.id);
  let product;
  try {
    username = userValidate.validateUsername(username);
    if (!sku) throw "Product ID not valid";
    sku = Number(sku);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    let updatedWishlist = await userData.removeProductFromWishlist(
      sku,
      username
    );
    product = await productData.getProductsByID(sku);
    console.log(product);
    return res
      .status(200)
      .json({ message: "Product removed from your wishlist" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Error while removing product from wishlist" });
  }
});

router.route("/viewhistory").get(async (req, res) => {
  //code here for GET
  let username = xss(req.session.username);
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
    res.render("users/viewHistory", {
      error: "Your view history is empty",
    });
  }
});

module.exports = router;
