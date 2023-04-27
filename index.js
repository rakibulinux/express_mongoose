const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Mongo DB Connections
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((error) => {
    console.log("Error in DB connection: " + error);
  });

// Schema
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this product"],
    trim: true,
    unique: true,
    minLength: [3, "Name must be at lease 3 characters."],
    maxLength: [100, "Name must be at lease 3 characters."],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price can't be negative"],
  },
  unit: {
    type: Number,
    required: true,
    enum: {
      value: ["kg", "litre", "pcs"],
      message: "Unit value can't be {VALUE}, must be kg/litle/pcs",
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "Qunatitly can't be negative"],
  },
});

// Middleware Connections
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

// Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
