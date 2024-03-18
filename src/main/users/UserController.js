const crudControllers = require("../../utils/crud")
const User = require("./UserModel")

module.exports = {
  ...crudControllers(User),
  async getMany(req, res) {
    const { skip, limit, search } = req.query
    const regex = new RegExp(search, "i")
    try {
      const doc = await User.find({
        role: "customer",
        ...(search && { email: { $regex: regex } })
      })
        .sort({ timestamp: -1 })
        .select("name email status")
        .limit(limit)
        .skip(skip)
        .lean()
        .exec()

      if (!doc) {
        return res
          .status(400)
          .json({ data: null, message: null, totalCount: 0 })
      }

      res.status(200).json({
        data: doc,
        message: null,
        totalCount: await User.count({ role: "customer" })
      })
    } catch (e) {
      console.error(e)
      res
        .status(500)
        .json({ data: null, message: "Server Error", totalCount: 0 })
    }
  }
}
