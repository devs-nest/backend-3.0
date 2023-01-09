const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const productController  = require('../controllers/product')
const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin,productController.create)

//UPDATE
router.put("/:id", verifyTokenAndAdmin, productController.update)

//DELETE
router.delete("/:id", verifyTokenAndAdmin,productController.update)

//GET PRODUCT
router.get("/find/:id", productController.getProduct)

//GET ALL PRODUCTS
router.get("/",productController.getAll)

module.exports = router;
