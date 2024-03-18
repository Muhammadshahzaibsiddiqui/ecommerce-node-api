const crudControllers = require("../../utils/crud")
const Newsletter = require("./NewsletterModel")

const searchQuery = "email"
module.exports = crudControllers(Newsletter, searchQuery)
