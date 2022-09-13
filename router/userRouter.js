const router = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

router.route("/signup").post(authController.signUp);
router.route("/signin").post(authController.signIn);

router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
