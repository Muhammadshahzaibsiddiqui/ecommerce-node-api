const { Router } = require("express")
const controllers = require("./UserController")
const { protectByAdmin } = require("../../utils/auth")
const router = Router()

// /api/list
router.route("/").get(protectByAdmin, controllers.getMany)

// /api/list/:id
router
  .route("/:id")
  .put(protectByAdmin, controllers.updateOne)
  .delete(protectByAdmin, controllers.removeOne)

module.exports = router
