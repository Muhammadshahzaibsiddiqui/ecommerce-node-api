const crudControllers = require("../../utils/crud")
const Product = require("./ProductModel")
const Favorite = require("../favorites/FavoriteModel")

module.exports = {
  ...crudControllers(Product),
  async getMany(req, res) {
    const {
      category,
      search,
      status,
      skip,
      limit,
      isItNew,
      priceMin,
      priceMax,
      selectedStyle,
      selectedSizes
    } = req.query
    const regex = new RegExp(search, "i")
    try {
      const docs = await Product.find({
        ...(req.user._id && { createdBy: req.user._id }),
        ...(category && { category }),
        ...(isItNew && { isItNew }),
        ...(status !== "All" && { status }),
        ...(search && { name: { $regex: regex } }),
        ...(selectedStyle && { byStyle: { $in: [selectedStyle] } }),
        ...(selectedSizes && { sizes: { $in: selectedSizes } }),
        ...(priceMin &&
          priceMax && { price: { $gte: priceMin, $lte: priceMax } })
      })
        .skip(skip)
        .limit(limit)
        .populate("category", "category")
        .select("name description code featureImage price discount deliveryDays status")
        .lean()
        .exec()

      const favorites = await Favorite.find({
        createdBy: req.user._id
      })

      favorites.forEach((favo) => {
        docs.map((product) => {
          if (favo.product.toHexString() === product._id.toHexString()) {
            product.isFavorite = true
            return product
          }
        })
      })

      res.status(200).json({
        data: docs,
        message: null,
        totalCount: await Product.count({
          ...(req.user._id && { createdBy: req.user._id }),
          ...(category && { category }),
          ...(status !== "All" && { status })
        })
      })
    } catch (e) {
      res
        .status(500)
        .json({ data: null, message: "Server Error", totalCount: 0 })
    }
  },
  async getOne(req, res) {
    try {
      const doc = await Product
        .findOne({
          ...(req.user._id && { createdBy: req.user._id }),
          _id: req.params.id
        })
        .populate("category")
        .lean()
        .exec()
        
      if (!doc) {
        return res.status(400).json({ data: null, message: "Data not found" })
      }
  
      res.status(200).json({ data: doc, message: null })
    } catch (e) {
      console.error(e)
      res.status(500).json({ data: null, message: "Server error" })
    }
  }
}
