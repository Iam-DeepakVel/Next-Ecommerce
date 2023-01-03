import { handle } from "../../db/mongoose";
import Order from "../../models/Order";
import Product from "../../models/Product";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await handle();

  if (req.method !== "POST") {
    res.send("Should a post but its not!");
    return;
  }
  // Getting the selected products from req.body
  const productsIds = req.body.products.split(",");
  const uniqueids = [...new Set(productsIds)];
  const products = await Product.find({ _id: { $in: uniqueids } }).exec();

  const { email,name,address,city } = req.body;

  let line_items = [];
  for (let productId of uniqueids) {
    const quantity = productsIds.filter((id) => id == productId).length;
    const product = products.find((p) => p._id.toString() === productId);

    line_items.push({
      quantity,
      price_data: {
        currency: "inr",
        product_data: { name: product.name },
        unit_amount: product.price * 100,
      },
    });
  }

  const order = await Order.create({
    products: line_items,
    name,
    email,
    address,
    city,
    paid: 0,
  });

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: "payment",
    customer_email: email,
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
    metadata: { orderId: order._id.toString() },
  });

  res.redirect(303, session.url);

}
