const mongoCollection = require("../config/mongoCollections");
const bcrypt = require("bcrypt");
const config = require("../config/settings.json");
const { ObjectId } = require("mongodb");
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
  let tempUser = await usersCollection.findOne({ username: username.toLowerCase() });
  if (tempUser) throw "Error: User already exists";

  tempUser = await usersCollection.findOne({ email: email });
  if (tempUser) throw "Error: User with the given email already exists";

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  user = {
    username: username.toLowerCase(),
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    userType: "user",
    wishlist: [],
    history: [],
    likedReviews: [],
    dislikedReviews: [],
  };
  //////console.log("User ",user);
  let insertInfo = await usersCollection.insertOne(user);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not create the user account";
  return { insertedUser: true };
};

const checkUser = async (username, password) => {
  username = userValidate.validateUsername(username);
  password = userValidate.validatePassword(password);

  let query = {
    $or: [{ username: username.toLowerCase() }],
  };

  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne(query);
  //////console.log(user);
  if (!user) throw "Error: Either the username or password is invalid";

  let compareToHash = false;
  compareToHash = await bcrypt.compare(password, user.password);

  if (compareToHash) {
    return { authenticatedUser: true, user: user };
  } else {
    throw "Error: Either the username or password is invalid";
  }
};

//User product wishlist APIs
const addProductToWishlist = async (productId, username) => {
  //Validate userId and productId
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  //////console.log(user);

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
  productId = Number(productId);
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  ////console.log(user);

  if (!user.wishlist.includes(productId)) {
    throw "Product does not exist in the wishlist";
  } else {
    let wishlist = user.wishlist;
    wishlist.splice(wishlist.indexOf(productId), 1);
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
  ////console.log("Wishlist Ids ", wishlist);
  let productCollection = await mongoCollection.products();
  let wishlistProducts = await productCollection
    .find({
      _id: { $in: wishlist },
    })
    .toArray();
  ////console.log("Wishlist ", wishlistProducts);
  return wishlistProducts;
};

//User product history APIs
const addProductToHistory = async (productId, username) => {
  //Validate userId and productId
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  ////console.log(user);

  if (user.history.includes(productId)) {
    const index = user.history.indexOf(productId);
    if (index > -1) {
      user.history.splice(index, 1);
    }
  }
  let history = user.history;
  user.history.unshift(productId);
  let updatedUser = {
    history: history,
  };
  await usersCollection.updateOne(
    { username: username },
    { $set: updatedUser }
  );

  return checkIfWishlisted(productId, username);
};

const removeProductFromHistory = async (productId, username) => {
  //Validate userId and productId
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  ////console.log(user);

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
  ////console.log("History Ids ", history);
  let productCollection = await mongoCollection.products();
  let historyProducts = await productCollection
    .find({
      _id: { $in: history },
    }).toArray();
    // .then((result) => {
    //   let sorted = history.map((i) => result.find((j) => j.id === i));
    //   ////console.log(sorted);
    // });
    let historyNew = [];
  for(let pid of history){
    //////console.log(pid);
    for(let pr of historyProducts){
      ////console.log(pr);
      if(pr._id === pid){
        historyNew.push(pr);
      }
    }
  }

  ////console.log("Wishlist ", historyNew);
  return historyNew;
};

const getUserProfile = async (username) => {
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  if (!user) throw "Error: User does not exists";
  return user;
};

const updateProfile = async (user) => {
  let newPassword, currentPassword;
  username = userValidate.validateUsername(user.username);
  firstName = userValidate.validateName(user.firstname, "First name");
  lastName = userValidate.validateName(user.lastname, "Last name");
  gender = userValidate.validateGender(user.gender);
  email = userValidate.validateEmail(user.email);

  newuser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
  };

  let usersCollection = await mongoCollection.users();
  let tempuser = await usersCollection.findOne({ username: user.username });

  if (!tempuser) throw "Error: User does not exists";
  if (user.currentPassword) {
    if (user.newPassword.length !== 0) {
      currentPassword = userValidate.validatePassword(user.currentPassword);
      newPassword = userValidate.validatePassword(user.newPassword);

      try {
        let auth = await checkUser(username, currentPassword);
      } catch (e) {
        throw "Error: Wrong current password entered";
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        config.bcrypt.saltRounds
      );
      newuser.password = hashedPassword;
    }
  }
  else {
    if (tempuser.firstName == firstName && tempuser.lastName == lastName && tempuser.gender == gender && tempuser.email == email)
      throw "No Change in details to modify the user profile";
  }


  const updateInfo = await usersCollection.updateOne(
    { username: user.username },
    { $set: newuser }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Update failed";
  return user;
};

const checkIfWishlisted = async (sku, username) => {
  let usersCollection = await mongoCollection.users();
  let user = await usersCollection.findOne({ username: username });
  if (user.wishlist.includes(sku)) return true;
  return false;
};



const seedUser = async (user) => {
  //Validate all fields to checck for valid inputs
  username = userValidate.validateUsername(user.username);
  firstName = userValidate.validateName(user.firstName, "First name");
  lastName = userValidate.validateName(user.lastName, "Last name");
  gender = userValidate.validateGender(user.gender);
  email = userValidate.validateEmail(user.email);
  password = userValidate.validatePassword(user.password);

  let usersCollection = await mongoCollection.users();
  let tempUser = await usersCollection.findOne({ username: username.toLowerCase() });
  if (tempUser) throw "Error: User already exists";

  tempUser = await usersCollection.findOne({ email: email });
  if (tempUser) throw "Error: User with the given email already exists";

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  user = {
    username: username.toLowerCase(),
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    userType: user.userType,
    wishlist: user.wishlist,
    history: user.history,
    likedReviews: [],
    dislikedReviews: [],
  };
  //////console.log("User ",user);
  let insertInfo = await usersCollection.insertOne(user);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not create the user account";
  return { insertedUser: true };
};

module.exports = {
  registerUser,
  checkUser,
  addProductToWishlist,
  getWishlistForUser,
  removeProductFromWishlist,
  addProductToHistory,
  removeProductFromHistory,
  getHistoryForUser,
  getUserProfile,
  checkIfWishlisted,
  updateProfile,
  seedUser
};
