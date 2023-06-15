const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const passport = require("passport");
const { auth } = require("../helpers/auth");

router.route("/login").get(UserController.Login);
router.route("/registration").get(UserController.Registration);
router.route("/login").post(UserController.Access);

module.exports = router;
