const pool = require('../../database');


const stripe_private_key = process.env.STRIPE_PRIVATE_KEY;
const stripe = require('stripe')(stripe_private_key);
let endpointSecret = process.env.ENDPOINT_SECRET
let url = process.env.NEXT_PUBLIC_BACKEND_URL
const logTransaction = async (data) => {
  try {
    const response = await fetch(`${url}/api/orders/uploadOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to call the other API');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error calling other API:', error);
    throw error;
  }
}

module.exports = {
  webHook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    }


    // Handle the event
    switch (eventType) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = data;

        let orderData = {
          id: paymentIntentSucceeded.id,
          status: 'Payment Succeeded',
          price: paymentIntentSucceeded.amount,
          user_id: paymentIntentSucceeded.metadata.user_id,
          car_id: paymentIntentSucceeded.metadata.car_id
        }

        try {
          const response = await logTransaction(orderData);
          console.log('Response from other API:', response);
        } catch (error) {
          console.error('Error handling other API:', error);
          // Handle error response if needed
        }

        break;
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  },

}
