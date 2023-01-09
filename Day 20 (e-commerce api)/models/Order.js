const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref:'Product'
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: 
    { 
      type: String,
      trim:true,
      enum:{
        values:["Pending","Complete","Cancelled"]
      },
      default:"Pending",
      required:[true,"Order status is required"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
