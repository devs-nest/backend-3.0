const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); //* bcrypt is a 3rd party library which we use to hash, salt and compare passwords
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Order = require("../models/orderModel");
const { isAuthenticated, isBuyer } = require("../middleware/auth");

const SECRET = "This is our secret";

const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - isSeller
 *       properties:
 *         id:
 *           type: INTEGER
 *           description: The auto-generated id of the user
 *         name:
 *           type: STRING
 *           description: The name of the user
 *         email:
 *           type: STRING
 *           description: The email of the user
 *         password:
 *           type: STRING
 *           description: The password of the user
 *         isSeller:
 *           type: BOOLEAN
 *           description: The role of the user
 *       example:
 *         name: Harsh
 *         email: hk@gmail.com
 *         password: Harsh@58
 *         isSeller: false
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       403:
 *         description: There was already an existing user with the same email
 *       400:
 *         description: Validation failed for the name, email or password
 *       500:
 *         description: Some server error
 */

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isSeller } = req.body; //* destructuring name, email and password out of the request body

    const existingUser = await User.findOne({ where: { email: email } }); //* check if the user with the entered email already exists in the database
    if (existingUser) {
      return res.status(403).json({ err: "User already exists" });
    }

    if (!validateName(name)) {
      return res.status(400).json({
        err: "Invalid user name: name must be longer than two characters and must not include any numbers or special characters",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ err: "Error: Invalid email" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        err: "Error: Invalid password: password must be at least 8 characters long and must include atleast one - one uppercase letter, one lowercase letter, one digit, one special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10)); //* hashes the password with a salt, generated with the specified number of rounds

    const user = {
      email,
      name,
      password: hashedPassword,
      isSeller: isSeller || false,
    };
    const createdUser = await User.create(user);

    return res.status(201).json({
      message: `Welcome to Devsnest ${createdUser.name}. Thank you for signing up`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

/**
 * @swagger
 * /api/v1/user/signin:
 *   post:
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            email:
 *             type: string
 *             description: The email of the user
 *            password:
 *             type: string
 *             description: The password of the user
 *          example:
 *           email: hk@gmail.com
 *           password: Harsh@58
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       403:
 *         description: No user with the entered email exists
 *       400:
 *         description: Validation failed for the name, email or password
 *       500:
 *         description: Some server error
 */

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body; //* destructuring email and password out of the request body

    if (email.length === 0) {
      return res.status(400).json({ err: "Please enter your email" });
    }
    if (password.length === 0) {
      return res.status(400).json({ err: "Please enter your password" });
    }

    const existingUser = await User.findOne({ where: { email: email } }); //* check if the user with the entered email exists in the database
    if (!existingUser) {
      return res.status(404).json("Error: User not found");
    }

    //* hashes the entered password and then compares it to the hashed password stored in the database
    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      return res.status(400).send("Error: Incorrect password");
    }

    const payload = { user: { id: existingUser.dataValues.id } };
    const bearerToken = await jwt.sign(payload, SECRET, {
      expiresIn: 360000,
    });

    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    console.log("Logged in successfully");

    return res
      .status(200)
      .json({ message: "Signed In Successfully!", bearerToken: bearerToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

/**
 * @swagger
 * /api/v1/user/signout:
 *   get:
 *     summary: Sign in an out the user
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Some server error
 */

router.get("/signout", (_req, res) => {
  try {
    res.clearCookie("t");
    return res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
});

router.get("/orders", isAuthenticated, isBuyer, async (req, res) => {
  try {
    // Get all orders of the user
    const orders = await Order.findAll({
      where: { buyerID: req.user.id },
      include: [{ model: User, attributes: ["name"] }],
    });
    return res.status(200).json({ orders });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
});

module.exports = router;
