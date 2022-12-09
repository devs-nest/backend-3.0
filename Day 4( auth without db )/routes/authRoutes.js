const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); //* bcrypt is a 3rd party library which we use to hash, salt and compare passwords
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

let users = {}; //* This will be our database

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body; //* destructuring name, email and password out of the request body

    const userExists = users.hasOwnProperty(email);

    if (userExists) {
      return res.status(403).send("User already exists"); //* check if the user with the entered email already exists in the database
    }

    if (!validateName(name)) {
      return res
        .status(400)
        .send(
          "Error: Invalid user name: name must be longer than two characters and must not include any numbers or special characters"
        );
    }

    if (!validateEmail(email)) {
      return res.status(400).send("Error: Invalid email");
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .send(
          "Invalid password: password must be at least 8 characters long and must include atlest one - one uppercase letter, one lowercase letter, one digit, one special character"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10); //* hashes the password with a salt, generated with the specified number of rounds

    users[email] = {
      name: name,
      password: hashedPassword,
    }; //* Saving user to the database

    return res
      .status(201)
      .send(
        `Welcome to Devsnest ${users[email].name}. Thank you for signing up`
      );
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body; //* destructuring email and password out of the request body

    if (email.length === 0) {
      return res.status(400).send("Error: Please enter your email");
    }
    if (password.length === 0) {
      return res.status(400).send("Error: Please enter your password");
    }

    const userExists = users.hasOwnProperty(email); //* check if the user with the entered email exists in the database

    if (!userExists) {
      return res.status(404).send("Error: User not found");
    }

    //* hashes the entered password and then compares it to the hashed password stored in the database
    const passwordMatched = await bcrypt.compare(
      password,
      users[email].password
    );

    if (!passwordMatched) {
      return res.status(403).send("Error: Incorrect password");
    }

    return res
      .status(200)
      .send(`Welcome to Devsnest ${existingUser.name}. You are logged in`);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
});

module.exports = router;
