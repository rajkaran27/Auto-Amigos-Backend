const express = require('express');
const createHttpError = require('http-errors');
const cors = require('cors');

const carRoutes = require('./api/routes/carRoutes');
const userRoutes = require('./api/routes/userRoutes');
const reviewRoutes = require('./api/routes/reviewRoutes');
const webhookRoutes = require('./api/routes/webhookRoutes');
const adminRoutes = require('./api/routes/adminRoutes')
const adminUserRoutes = require('./api/routes/adminUserRoutes')
const stripeRoutes = require('./api/routes/stripeRoutes')
const orderRoutes = require('./api/routes/orderRoutes')


const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
app.use(express.json()); // to process JSON in request body
app.use('/api/admin/',adminUserRoutes);
app.use('/api', carRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pay',stripeRoutes)
app.use('/api/orders',orderRoutes)

app.use(function (req, res, next) {
    return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
});


app.use(function (err, req, res, next) {
    return res.status(err.status || 500).json({ error: err.message || 'Unknown Server Error!' });
});

module.exports = app;
