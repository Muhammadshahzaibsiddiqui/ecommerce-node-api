const mongoose = require("mongoose")

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    url: {
      type: String
    },
    image: {
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

const Slider = mongoose.model("sliders", sliderSchema)

module.exports = Slider
