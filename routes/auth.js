const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    User.findOne({ email: email }).exec((error, user) => {
      if (user) {
        return res.status(400).json({ message: "User already registered" });
      }
    });

    bcrypt.hash(password, 12).then((hashedpassword) => {
      const user = new User({
        email,
        name,
        password: hashedpassword,
      });

      user.save((error, data) => {
        if (error) {
          return res.status(400).json({ message: "Something went wrong" });
        }
        if (data) {
          res.status(201).json({ message: "User successfully created" });
        }
      });
    });
  }
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ message: "Please enter email or password" });
  }
  User.findOne({ email: email }).then((saved_user) => {
    if (!saved_user) {
      return res.status(422).json({ message: "Invaild email or password" });
    }
    bcrypt
      .compare(password, saved_user.password)
      .then((doMatch) => {
        if (doMatch) {
          res.status(200).json({ message: "Successfully Signed In" });
        } else {
          return res.status(422).json({ message: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
