const crudControllers = require("../../utils/crud")
const Currency = require("./CurrencyModel")

const searchQuery = "currency"
module.exports = crudControllers(Currency, searchQuery)
