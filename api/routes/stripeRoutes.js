const express = require("express");
const router = express.Router();
const stripe = require("../controllers/stripe");

router.post('/create-payment-intent',stripe.createPaymentSession);
module.exports = router;
