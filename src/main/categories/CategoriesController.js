const crudControllers = require("../../utils/crud")
const Categories = require("./CategoriesModel")

const searchQuery = "category"
module.exports = crudControllers(Categories, searchQuery)
