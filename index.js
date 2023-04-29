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
const productSchema = mongoose.Schema(
  {
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
      type: String,
      required: true,
      enum: {
        values: ["kg", "litre", "pcs"],
        message: "Unit value can't be {VALUE}, must be kg/litle/pcs",
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Qunatitly can't be negative"],
      validate: {
        validator: (value) => {
          const isInteger = Number.isInteger(value);
          if (isInteger) {
            return true;
          } else {
            return false;
          }
        },
      },
      message: "Quantity must be an integer",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["in-stock", "out-of-stock", "discontinued"],
        message: "status can't be {VALUE}",
      },
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // supplier: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Supplier",
    // },
    // categories: [
    //   {
    //     name: {
    //       type: String,
    //       require: true,
    //     },
    //     _id: mongoose.Schema.Types.ObjectId,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

// SCHEMA -> MODEL -> QUERY

const Product = mongoose.model("Product", productSchema);

// Middleware Connections
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

app.post("/api/v1/product", async (req, res, next) => {
  try {
    // Save or Create

    //Save methood
    const product = new Product(req.body);

    // Instent create -> Do something -> save()
    if (product.quantity === 0) {
      product.status = "out-of-stock";
    }

    const sendProduct = await product.save();

    //Create methood
    // const sendProduct = await Product.create(req.body);

    res.status(200).json({
      status: "success",
      message: "Data inserted successfully",
      data: sendProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Data is not inserted",
      error: error.message,
    });
  }
  //Save and create
});

// Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
