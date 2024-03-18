const mongoose = require("mongoose")

const deliveryConfigsSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    deliveryCharges: {
      type: Number,
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

deliveryConfigsSchema.index({ country: 1 }, { unique: true })

const DeliveryConfigs = mongoose.model("deliveryConfigs", deliveryConfigsSchema)

module.exports = DeliveryConfigs
