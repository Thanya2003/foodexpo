const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  console.log("Received registration request:", req.body);
  try {
    // Validate the request body
    const { error } = validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("User already exists:", req.body.email);
      return res.status(409).send({ message: "User with given email is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create and save the new user
    const newUser = new User({
      ...req.body,
      password: hashPassword
    });

    console.log("Attempting to save user:", newUser);
    await newUser.save();

    console.log("User registered successfully:", newUser.email);
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;