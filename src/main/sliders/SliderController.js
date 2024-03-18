const crudControllers = require("../../utils/crud")
const Slider = require("./SliderModel")

const searchQuery = "title"
module.exports = crudControllers(Slider, searchQuery)
