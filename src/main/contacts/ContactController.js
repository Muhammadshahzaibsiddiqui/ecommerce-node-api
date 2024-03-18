const crudControllers = require("../../utils/crud")
const Contact = require("./ContactModel")

const searchQuery = "number"
module.exports = crudControllers(Contact, searchQuery)
