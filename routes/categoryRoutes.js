const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const { auth } = require("../helpers/auth");
const demoMode = require("../middlewares/demoMode");

router.route("/categories").get(auth, CategoryController.Show);

router
  .route("/add/category")
  .get(auth, CategoryController.Add)
  .post(auth, demoMode, CategoryController.Store);

router
  .route("/edit/category/:id")
  .get(auth, CategoryController.Edit)
  .post(auth, demoMode, CategoryController.Update);
  
router
  .route("/delete/category/:id")
  .post(auth, demoMode, CategoryController.Delete);

module.exports = router;
