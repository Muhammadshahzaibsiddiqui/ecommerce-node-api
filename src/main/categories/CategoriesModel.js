const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    slug: {
      type: String,
      required: true
    },
    discount: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: true }
)

categoriesSchema.index({ category: 1 }, { unique: true })

const Categories = mongoose.model("categories", categoriesSchema)

module.exports = Categories
