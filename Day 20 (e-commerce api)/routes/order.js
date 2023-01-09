const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const router = require("express").Router();
const orderController = require('../controllers/order')
//CREATE

router.post("/", verifyToken,orderController.createOrder)

//UPDATE
router.put("/:id", verifyTokenAndAdmin, orderController.update)

//DELETE
router.delete("/:id", verifyTokenAndAdmin, orderController.delete)

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, orderController.getUserOrders)

// //GET ALL

router.get("/", verifyTokenAndAdmin, orderController.getAll)

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, orderController.getMonthlyIncome)

module.exports = router;
