const mongoose = require("mongoose")

const currencySchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    exchangeRate: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: true }
)

currencySchema.index({ currency: 1, exchangeRate: 1 }, { unique: true })

const Currency = mongoose.model("currency", currencySchema)

module.exports = Currency
