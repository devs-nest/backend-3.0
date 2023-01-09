const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");


const router = require("express").Router();

const cartController = require('../controllers/cart')
//CREATE

router.post("/", verifyToken,cartController.createCart)

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, cartController.updateCart)

//DELETE
router.delete("/:id", verifyTokenAndAuthorization,cartController.deleteCart)

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, cartController.findUser);

// //GET ALL

router.get("/", verifyTokenAndAdmin, cartController.getAll)

module.exports = router;
