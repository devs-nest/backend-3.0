const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "place-your-stripe-key-here"
); 
const { WebhookClient } = require("discord.js");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const uploadContent = require("../utils/fileUpload");
const { isAuthenticated, isSeller, isBuyer } = require("../middleware/auth");

const webhookClient = new WebhookClient({
  url: "enter your discord webhook url here",
});

router.post("/create", isAuthenticated, isSeller, (req, res) => {
  uploadContent(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ err: err.message });
    }

    console.log(
      req.user.dataValues.id,
      req.user.dataValues.isSeller,
      req.user.dataValues.email
    );

    console.log(req.body.name, req.body.price, req.file);

    if (!req.body.name || !req.body.price || !req.file) {
      return res
        .status(400)
        .json({ err: "All fields should be selected - name, price, file" });
    }

    if (isNaN(req.body.price)) {
      return res.status(400).json({ err: "Price must be a number" });
    }

    let productDetails = {
      name: req.body.name,
      price: req.body.price,
      content: req.file.path,
    };

    const createdProduct = await Product.create(productDetails);
    console.log(createdProduct);
    return res.status(201).json({ message: "Product created" });
  });
});

router.get("/get/all", isAuthenticated, async (_req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ Products: products });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
});

router.post("/buy/:productID", isAuthenticated, isBuyer, async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productID },
    });

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }

    const orderDetails = {
      productID: product.dataValues.id,
      productName: product.dataValues.name,
      productPrice: product.dataValues.price,
      buyerID: req.user.dataValues.id,
      buyerEmail: req.user.dataValues.email,
    };

    let paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 9,
        exp_year: 2023,
        cvc: "314",
      },
    });

    let paymentIntent = await stripe.paymentIntents.create({
      amount: product.dataValues.price * 100,
      currency: "inr",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
    });

    if (paymentIntent) {
      const createdOrder = await Order.create(orderDetails);

      // send a discord message after order is created
      webhookClient.send({
        content: `Order Details\nOrderID:${createdOrder.id}\nProduct ID: ${createdOrder.productID}\nProduct Name: ${createdOrder.productName}\nProduct Price: ${createdOrder.productPrice}\nBuyer Name:${req.user.name}\nBuyer Email: ${createdOrder.buyerEmail}`,
        username: "order-keeper",
        avatarURL: "https://i.imgur.com/AfFp7pu.png",
      });

      return res.status(201).json({ message: "Order created", createdOrder });
    } else {
      return res.status(400).json({ err: "Something went wrong" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
});

module.exports = router;
