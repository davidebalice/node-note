const express = require("express");
const router = express.Router();
const NoteController = require("../controllers/NoteController");
const passport = require("passport");
const { auth } = require("../helpers/auth");

router.route("/").get(auth, NoteController.Index);
router.route("/info").get(NoteController.Info);
router.route("/notes").get(auth, NoteController.Notes);
router.route("/add/note").get(auth, NoteController.Add);
router.route("/add/note").post(auth, NoteController.Store);
router.route("/edit/note/:id").get(auth, NoteController.Edit);
router.route("/edit/note/:id").post(auth, NoteController.Update);
router.route("/delete/note/:id").post(auth, NoteController.Delete);

module.exports = router;
