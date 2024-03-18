const express = require("express")
const controllers = require("./FavoriteController")

const router = express.Router()
const { protect } = require("../../utils/auth")

// /api/list
router
  .route("/")
  .get(protect, controllers.getMany)
  .post(protect, controllers.createOne)

// /api/list/:id
router.route("/:id").delete(protect, controllers.removeOne)

module.exports = router
