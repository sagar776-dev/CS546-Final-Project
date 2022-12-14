const adminRoutes = require('./admin');
const productsRoutes = require('./products');
const reviewsRoutes = require('./reviews');
const usersRoutes = require('./users');
const homeRoutes = require('./home');
const qnaRoutes = require('./qna');

const constructorMethod = (app) => {
    app.use('/admin', adminRoutes);
    app.use('/api/products', productsRoutes);
    app.use('/api/reviews', reviewsRoutes);
    app.use('/users', usersRoutes);
    app.use('/api/qna', qnaRoutes);
    
    app.use('/api', homeRoutes);
    app.use("/", (req, res) => {
      res.redirect("/api")
    });
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
