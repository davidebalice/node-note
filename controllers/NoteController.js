const Note = require("../models/note");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ApiQuery = require("../utils/apiquery");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const moment = require("moment");

exports.Index = catchAsync(async (req, res, next) => {
  const title = "Note management";
  if (req.user.id) {
    const userId = req.user.id;
    const ApiFeatures = new ApiQuery(
      Note.find({ user_id: { $eq: userId } }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const note = await ApiFeatures.query;

    const arr = Object.keys(note).map((key) => {
      let formattedData = moment(note[key].data).format("DD/MM/YYYY HH:mm");
      return {
        _id: note[key]._id,
        title: note[key].title,
        description: note[key].description,
        data: formattedData,
      };
    });

    res.render("index", { note: arr });
  } else {
    res.render("login");
  }
});

exports.Info = catchAsync(async (req, res, next) => {
  const title = "Info";
  res.render("info", { title: title });
});

exports.Notes = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const ApiFeatures = new ApiQuery(
    Note.find({ user_id: { $eq: userId } }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const note = await ApiFeatures.query;

  const arr = Object.keys(note).map((key) => {
    let formattedData = moment(note[key].data).format("DD/MM/YYYY HH:mm");
    return {
      _id: note[key]._id,
      title: note[key].title,
      description: note[key].description,
      data: formattedData,
    };
  });

  res.render("notes", { note: arr });
});

exports.Add = catchAsync(async (req, res, next) => {
  const title = "Add note";
  res.render("add_note", { title: title });
});

exports.Store = catchAsync(async (req, res, next) => {
  let error = [];
  if (!req.body.title) {
    error.push({ text: "Enter title" });
  }
  if (!req.body.description) {
    error.push({ text: "Enter description" });
  }
  if (error.length > 0) {
    console.log(error);
    res.render("add_note", {
      error: error,
      title: req.body.title,
      description: req.body.description,
    });
  } else {
    //res.send('ok, funziono!');
    const newNote = {
      title: req.body.title,
      description: req.body.description,
      user_id: req.user.id,
    };
    new Note(newNote).save().then((note) => {
      req.flash("msg_ok", "Note added");
      res.redirect("/");
    });
  }
});

exports.Edit = catchAsync(async (req, res, next) => {
  const title = "Edit note";
  await Note.findOne({
    _id: req.params.id,
  }).then((note) => {
    if (note.user_id != req.user.id) {
      req.flash("msg_ko", "Reserved area");
      res.redirect("/");
    } else {
      res.render("edit_note", {
        note,
        title,
      });
    }
  });
});

exports.Update = catchAsync(async (req, res, next) => {
  Note.findOne({
    _id: req.params.id,
  }).then((note) => {
    note.title = req.body.title;
    note.description = req.body.description;
    note.save().then((note) => {
      req.flash("msg_ok", "Nota updated");
      res.redirect("/");
    });
  });
});

exports.Delete = catchAsync(async (req, res, next) => {
  Note.deleteOne({
    _id: req.params.id,
  }).then(() => {
    req.flash("msg_ok", "Note deleted");
    res.redirect("/");
  });
});
