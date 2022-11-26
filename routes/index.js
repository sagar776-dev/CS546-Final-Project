const adminRoutes = require('./admin');
const productsRoutes = require('./products');
const reviewsRoutes = require('./reviews');
const usersRoutes = require('./users');


const constructorMethod = (app) => {
    app.use('/admin', adminRoutes);
    app.use('/products', productsRoutes);
    app.use('/reviews', reviewsRoutes);
    app.use('/users', usersRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;