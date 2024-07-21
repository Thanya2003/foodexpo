const router = require("express").Router();
const { FoodItem } = require("../models/FoodItem");
const auth = require("../middleware/auth"); // Assuming you have authentication middleware

router.post("/", auth, async (req, res) => {
  try {
    const { name, manufactureDate, expirationDate, quantity } = req.body;

    // Validate dates
    const mfgDate = new Date(manufactureDate);
    const expDate = new Date(expirationDate);

    if (isNaN(mfgDate.getTime()) || isNaN(expDate.getTime())) {
      return res.status(400).send({ message: "Invalid date format" });
    }

    if (mfgDate > expDate) {
      return res.status(400).send({ message: "Manufacture date cannot be later than expiration date" });
    }

    const newFoodItem = new FoodItem({
      name,
      manufactureDate: mfgDate,
      expirationDate: expDate,
      quantity,
      userId: req.user._id // Assuming your auth middleware adds user to the request
    });

    await newFoodItem.save();

    res.status(201).send({ message: "Food item added successfully", foodItem: newFoodItem });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).send({ message: "Error adding food item", error: error.message });
  }
});

module.exports = router;