const pool = require('../../database');


const stripe_private_key = process.env.STRIPE_PRIVATE_KEY;
const stripe = require('stripe')(stripe_private_key);

module.exports = {
    createPaymentSession: async (req, res) => {
        const calculateOrderAmount = (items) => {
            const price = parseFloat(items[0].price);
            return Math.round(price * 100); // Convert to cents
        };
        const { items } = req.body;
        console.log(items)
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: calculateOrderAmount(items),
                currency: "sgd",
                payment_method_types: ['card'], // Specify the allowed payment method types (e.g., card)
                metadata: {
                    car_id: items[0].car_id,
                    user_id: items[0].user_id
                },
            });

            res.json({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).send({ error: 'Failed to create payment intent' });
        }
    },
}