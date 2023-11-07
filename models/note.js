const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: "fefda2",
  },
  cat_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  sticky: {
    type: Boolean,
    default: false,
  },
});

NoteSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cat_id",
    select: "title",
  });
  next();
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
