const express = require("express");
const router = express.Router();
const NoteController = require("../controllers/NoteController");
const demoMode = require("../middlewares/demoMode");
const passport = require("passport");
const { auth } = require("../helpers/auth");

router.route("/").get(auth, NoteController.Index);

router
  .route("/add/note")
  .get(auth, NoteController.Add)
  .post(auth, demoMode, NoteController.Store);

router
  .route("/edit/note/:id")
  .get(auth, NoteController.Edit)
  .post(auth, demoMode, NoteController.Update);

router.route("/delete/note/:id").post(auth, demoMode, NoteController.Delete);

module.exports = router;
