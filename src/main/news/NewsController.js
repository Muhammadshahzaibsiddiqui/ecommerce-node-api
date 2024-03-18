const crudControllers = require("../../utils/crud")
const News = require("./NewsModel")

module.exports = {
  ...crudControllers(News),
  async createOne(req, res) {
    const createdBy = req.user._id
    try {
      const newsRemove = await News.deleteMany()
      if (newsRemove) {
        const doc = await News.create({ ...req.body, createdBy })
        res.status(201).json({ data: doc, message: null })
      }
    } catch (e) {
      console.error(e)
      res.status(500).json({ data: null, message: "Server Error" })
    }
  }
}
