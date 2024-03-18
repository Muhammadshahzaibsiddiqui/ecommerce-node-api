const express = require("express")
const controllers = require("./CurrencyController")
const { protectByAdmin } = require("../../utils/auth")

const router = express.Router()

// /api/list
router
  .route("/")
  .get(controllers.getMany)
  .post(protectByAdmin, controllers.createOne)

// /api/list/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(protectByAdmin, controllers.updateOne)
  .delete(protectByAdmin, controllers.removeOne)

module.exports = router
