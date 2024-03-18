const express = require("express")
const controllers = require("./NewsletterController")
const { protectByAdmin } = require("../../utils/auth")
const router = express.Router()

// /api/list
router
  .route("/")
  .get(protectByAdmin, controllers.getMany)
  .post(controllers.createOne)

// /api/list/:id
router.route("/:id").delete(controllers.removeOne)

module.exports = router
