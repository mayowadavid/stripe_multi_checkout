const express = require('express');
const app = express();
const { resolve } = require("path");
const env = require("dotenv").config({ path: ".env" });
// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(express.static('public'));

const YOUR_DOMAIN = process.env.URL;

app.get("/", (req, res) => {
  // Display checkout page
  const path = resolve("public/checkout.html");
  res.sendFile(path);
});

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        //price: "price_1KGsHCLJV0ISPCLdGJGTjDq3",
        price: process.env.PRICES,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));
