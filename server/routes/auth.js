const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  console.log("Received login request");
  try {
    // Validate request body
    const { error } = validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if user exists
    console.log("Searching for user with email:", req.body.email);
    const user = await User.findOne({ email: req.body.email }).catch(err => {
      console.error("Database error when finding user:", err);
      throw err;
    });

    if (!user) {
      console.log("User not found");
      return res.status(401).send({ message: "Invalid email or password" });
    }

   
    console.log("Verifying password");
    const validPassword = await bcrypt.compare(req.body.password, user.password).catch(err => {
      console.error("Error comparing passwords:", err);
      throw err;
    });

    if (!validPassword) {
      console.log("Invalid password");
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Generate and send token
    console.log("Generating auth token");
    const token = user.generateAuthToken();
    console.log("Login successful");
    res.status(200).send({ token, message: "Login Successful" });

  } catch (error) {
    console.error("Detailed login error:", error);
    res.status(500).send({ message: "Internal server error", error: error.toString() });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password")
  });
  return schema.validate(data);
};

module.exports = router;