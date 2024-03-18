const crudControllers = require("../../utils/crud")
const Favorites = require("./FavoriteModel")

module.exports = {
  ...crudControllers(Favorites),
  async createOne(req, res) {
    try {
      const favorite = await Favorites.create({
        ...req.body,
        createdBy: req.user._id
      })
      res.status(201).json({ data: favorite, message: null })
    } catch (err) {
      console.error(err)
      res.status(500).json({ data: null, message: "Server Error" })
    }
  },
  async removeOne(req, res) {
    try {
      const favorite = await Favorites.findOneAndRemove({
        createdBy: req.user._id,
        product: req.params.id
      })
      if (!favorite) {
        return res
          .status(404)
          .json({ data: null, message: "Favorite not found" })
      }
      await favorite.remove()
      res.json({ data: "Favorite removed", message: null })
    } catch (err) {
      console.error(err)
      res.status(500).json({ data: null, message: "Server Error" })
    }
  },
  async getMany(req, res) {
    try {
      const docs = await Favorites.find({
        createdBy: req.user._id
      })
        .populate("product", "name price discount featureImage")
        .lean()
        .exec()

      res.status(200).json({
        data: docs,
        message: null,
        totalCount: await Favorites.count({
          ...(req.user._id &&
            req.user.role !== "admin" && { createdBy: req.user._id })
        })
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ data: null, message: "Server Error" })
    }
  }
}
