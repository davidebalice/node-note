const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const passport = require("passport");
const { auth } = require("../helpers/auth");

router.route("/login").get(UserController.Login).post(UserController.Access);
router.route("/registration").get(UserController.Registration);

module.exports = router;
