const mongoose = require("mongoose")

const newsSchema = new mongoose.Schema(
  {
    news: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    link: {
      type: String
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: true }
)

const News = mongoose.model("news", newsSchema)

module.exports = News
