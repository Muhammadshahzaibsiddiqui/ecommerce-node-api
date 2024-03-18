const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    isItNew: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number
    },
    code: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "categories",
      required: true
    },
    sizes: {
      type: Array,
      required: true
    },
    featureImage: {
      type: String,
      required: true
    },
    images: {
      type: Array
    },
    deliveryDays: {
      type: Number,
      required: true
    },
    byStyle: {
      type: Array
    },
    customProducts: [
      {
        name: {
          type: String,
          required: true
        },
        status: {
          type: Boolean,
          default: false
        },
        sizes: {
          type: Array,
          required: true
        },
        price: {
          type: String,
          required: true
        },
        discount: {
          type: String
        },
        deliveryDays: {
          type: Number,
          required: true
        }
      }
    ],
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: true }
)

productSchema.index({ name: 1 }, { unique: true })

const Product = mongoose.model("products", productSchema)

module.exports = Product
