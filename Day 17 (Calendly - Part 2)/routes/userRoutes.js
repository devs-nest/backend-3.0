const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

const router = express.Router();

// @route   POST api/v1/user/signup
// @desc    Register user
// @access  Public

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }); //* check if the user with the entered email already exists in the database

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

    const userDetails = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userDetails); //* creates a new user in the database
    await newUser.save();

    console.log(newUser);
    return res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

// @route   POST api/v1/user/signin
// @desc    Login user
// @access  Public

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length === 0) {
      return res.status(400).json({ err: "Please enter your email" });
    }
    if (password.length === 0) {
      return res.status(400).json({ err: "Please enter your password" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ err: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    ); //* compares the entered password with the hashed password in the database

    if (!isPasswordCorrect) {
      return res.status(400).json({ err: "Invalid credentials" });
    }
    console.log(existingUser, existingUser.id);
    const payload = { user: { id: existingUser.id } };
    const bearerToken = await jwt.sign(payload, process.env.SECRET, {
      expiresIn: 360000,
    });

    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    console.log("Logged in successfully");

    return res.status(200).json({ msg: "Signed-In successfully", bearerToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

// @route   GET api/v1/user/signout
// @desc    Logout user
// @access  Public

router.get("/signout", (_req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ msg: "Signed-Out successfully" });
});

module.exports = router;
