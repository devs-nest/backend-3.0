const express = require("express");
const router = express.Router();
const uploadContent = require("../utils/fileUpload");
const Product = require("../models/productModel");
const { isAuthenticated, isSeller } = require("../middleware/auth");

router.post("/create", isAuthenticated, isSeller, (req, res) => {
  uploadContent(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ err: err.message });
    }
    console.log(req.body.file, req.body.price, req.body.file);
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

    console.log("Created Product", createdProduct);
    
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

module.exports = router;
