const mongoose = require("mongoose")

const ordersSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true
    },
    customer: {
      name: {
        type: String,
        required: true
      },
      mobile: {
        type: String,
        required: true
      }
    },
    deliveryDetails: {
      address: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      }
    },
    products: [
      {
        orderNote: String,
        orderProduct: {
          type: String
        },
        orderSize: {
          type: String,
          required: true
        },
        orderType: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    deliveryCharges: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Dispatched", "Delivered", "Cancel"],
      default: "Pending"
    },
    paymentType: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user"
    }
  },
  { timestamps: true }
)

const Orders = mongoose.model("orders", ordersSchema)

module.exports = Orders
