const adminRoutes = require("./admin");
const productsRoutes = require("./products");
const reviewsRoutes = require("./reviews");
const usersRoutes = require("./users");

const constructorMethod = (app) => {
  app.use("/", (req, res) => {
    res.redirect("/api/products");
  });

  app.use("/api/admin", adminRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/reviews", reviewsRoutes);
  app.use("/users", usersRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
