const adminRoutes = require('./admin');
const productsRoutes = require('./products');
const reviewsRoutes = require('./reviews');
const usersRoutes = require('./users');
const path = require('path');


const constructorMethod = (app) => {
    app.use('/admin', adminRoutes);
    app.use('/products', productsRoutes);
    app.use('/reviews', reviewsRoutes);
    app.use('/users', usersRoutes);

    app.use('/', async (req, res) => {
        res.sendFile(path.resolve('static/about.html'));
    });

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;