const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const { auth } = require("../helpers/auth");

router.route("/categories").get(auth, CategoryController.Show);
router.route("/add/category").get(auth, CategoryController.Add);
router.route("/add/category").post(auth, CategoryController.Store);
router.route("/edit/category/:id").get(auth, CategoryController.Edit);
router.route("/edit/category/:id").post(auth, CategoryController.Update);
router.route("/delete/category/:id").post(auth, CategoryController.Delete);

module.exports = router;
