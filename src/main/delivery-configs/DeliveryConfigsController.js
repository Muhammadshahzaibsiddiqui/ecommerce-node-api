const crudControllers = require("../../utils/crud")
const DeliveryConfigs = require("./DeliveryConfigsModel")

const searchQuery = "country"
module.exports = crudControllers(DeliveryConfigs, searchQuery)
