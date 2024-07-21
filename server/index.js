require('dotenv').config();
const express = require('express');
const app = express();
const cors= require("cors");
const connection = require("./db")
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const foodRoutes = require('./routes/foodauth');
connection();

app.use(express.json())
app.use(cors())

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/food', foodRoutes);

const port =process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))