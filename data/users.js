const mongoCollection = require("../config/mongoCollections");
const bcrypt = require("bcrypt");
const config = require("../config/settings.json");

const userValidate = require("../helper/userValidation");

const registerUser = async (user) => {
  //Validate all fields to checck for valid inputs
  username = userValidate.validateUsername(user.username);
  firstName = userValidate.validateName(user.firstName, "First name");
  lastName = userValidate.validateName(user.lastName, "Last name");
  gender = userValidate.validateGender(user.gender);
  email = userValidate.validateEmail(user.email);
  password = userValidate.validatePassword(user.password);

  let usersCollection = await mongoCollection.users();
  let tempUser = await usersCollection.findOne({ username: username });
  if (tempUser) throw "Error: User already exists";

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  user = {
    username: username,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    userType: "user",
    wishlist: [],
    history: [],
  };
  //console.log("User ",user);
  let insertInfo = await usersCollection.insertOne(user);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not create the user account";
  return { insertedUser: true };
};

const checkUser = async (username, password) => {
  username = userValidate.validateUsername(username);
  password = userValidate.validatePassword(password);

  let query = {
    $or: [{ username: username }, { email: username }],
  };

  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne(query);
  console.log(user);
  if (!user) throw "Error: Either the username or password is invalid";

  let compareToHash = false;
  compareToHash = await bcrypt.compare(password, user.password);

  if (compareToHash) {
    return { authenticatedUser: true };
  } else {
    throw "Error: Either the username or password is invalid";
  }
};

//User product wishlist APIs
const addProductToWishlist = async (productId, username) => {
  //Validate userId and productId
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  console.log(user);

  if (user.wishlist.includes(productId)) {
    throw "Product already exists in the wishlist";
  } else {
    //user.wishlist.push(productId);
    let wishlist = user.wishlist;
    wishlist.push(productId);
    let updatedUser = {
      wishlist: wishlist,
    };
    await usersCollection.updateOne(
      { username: username },
      { $set: updatedUser }
    );
  }
};

const removeProductFromWishlist = async (productId, username) => {
  //Validate userId and productId
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  console.log(user);

  if (user.wishlist.includes(productId)) {
    throw "Product does not exist in the wishlist";
  } else {
    let wishlist = user.wishlist;
    wishlist = wishlist.splice(wishlist.indexOf(productId), 1);
    let updatedUser = {
      wishlist: wishlist,
    };
    await usersCollection.updateOne(
      { username: username },
      { $set: updatedUser }
    );
  }
};

const getWishlistForUser = async (username) => {
  username = userValidate.validateUsername(username);
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  let wishlist = user.wishlist;
  if (wishlist.length === 0) {
    throw "Wishlist is empty";
  }
  console.log("Wishlist Ids ", wishlist);
  let productCollection = await mongoCollection.products();
  let wishlistProducts = await productCollection
    .find({
      _id: { $in: wishlist },
    })
    .toArray();
  console.log("Wishlist ", wishlistProducts);
  return wishlistProducts;
};

//User product history APIs
const addProductToHistory = async (productId, username) => {
  //Validate userId and productId
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  console.log(user);

  if (user.history.includes(productId)) {
    throw "Product already exists in the wishlist";
  } else {
    let history = user.history;
    history.push(productId);
    let updatedUser = {
      history: history,
    };
    await usersCollection.updateOne(
      { username: username },
      { $set: updatedUser }
    );
  }
};

const removeProductFromHistory = async (productId, username) => {
  //Validate userId and productId
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  console.log(user);

  if (user.history.includes(productId)) {
    throw "Product does not exist in the history";
  } else {
    let history = user.history;
    history = wishlist.splice(history.indexOf(productId), 1);
    let updatedUser = {
      history: history,
    };
    await usersCollection.updateOne(
      { username: username },
      { $set: updatedUser }
    );
  }
};

const getHistoryForUser = async (username) => {
  username = userValidate.validateUsername(username);
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  let history = user.history;
  if (history.length === 0) {
    throw "History is empty";
  }
  console.log("History Ids ", history);
  let productCollection = await mongoCollection.products();
  let historyProducts = await productCollection
    .find({
      _id: { $in: history },
    })
    .toArray();
  console.log("Wishlist ", historyProducts);
  return wishlistProducts;
};

const userProfile = async (username) => {
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  if (!tempUser) throw "Error: User does not exists";
  return user;
}

// addProductToWishlist(6478315, "sagar776");
// getWishlistForUser("sagar776");

module.exports = {
  registerUser,
  checkUser,
  addProductToWishlist,
  getWishlistForUser,
  removeProductFromWishlist,
  addProductToHistory,
  removeProductFromHistory,
  getHistoryForUser,
  userProfile
};
