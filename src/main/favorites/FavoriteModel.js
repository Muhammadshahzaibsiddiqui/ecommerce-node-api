const mongoose = require("mongoose")

const favoriteSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "products",
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

const Favorites = mongoose.model("favorites", favoriteSchema)

module.exports = Favorites
