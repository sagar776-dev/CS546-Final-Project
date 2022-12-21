const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

const usersData = require("./data/users");

app.use("/public", static);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Handlebars.registerHelper('json', function(context) {
//   return JSON.stringify(context);
// });

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

// app.use("/", async (req, res, next) => {
//   res.redirect("/api/products");
// });

app.use(function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use("/", async (req, res, next) => {
  //console.log(req.session.username, req.originalUrl);
  //req.session.username = 'sagar776';
  next();
});

app.use("/api", async (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/users/login");
  }
});

app.use("/admin", async (req, res, next) => {
  if (req.session.username) {
    let userType = await usersData.getUserType(req.session.username);
    if (userType.toLowerCase() === "admin") {
      next();
    } else {
      res.redirect("/api");
    }
  } else {
    res.redirect("/api");
  }
});


app.use("/users/wishlist", async (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/users/login");
  }
});

app.use("/users/viewhistory", async (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/users/login");
  }
});

app.use("/users/userprofile", async (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/users/login");
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
