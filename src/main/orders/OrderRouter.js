const express = require("express")
const controllers = require("./OrderController")
const { protect, availableAll } = require("../../utils/auth")
const router = express.Router()

// /api/list
router.route("/").get(protect, controllers.getMany).post(availableAll, controllers.createOne)

// /api/list/:id
router
  .route("/:id")
  .get(protect, controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

module.exports = router
