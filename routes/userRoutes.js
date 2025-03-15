const express = require("express");
const router = express.Router();
const protected = require("../middleware/protected");
const {
  loginController,
  registerController,
  userDataController,
  logoutController,
} = require("../controller/userController");

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/profile", protected, userDataController);
router.post("/logout", logoutController);
module.exports = router;
