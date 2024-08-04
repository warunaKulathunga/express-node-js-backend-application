const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    model: {
      type: String,
      required: [true, "Please add the product model"],
    },
    brand: {
      type: String,
      required: [true, "Please add the product brand"],
    },
    price: {
      type: String,
      required: [true, "Please add the product price"],
    },
    storage: {
      type: String,
      required: [true, "Please add the product storage"],
    },
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
