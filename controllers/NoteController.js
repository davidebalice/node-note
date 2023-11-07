const Note = require("../models/note");
const Category = require("../models/category");
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
      .sort({ sticky: 1, Date: -1 })
      .limitFields()
      .paginate();

    const flashMessage = req.session.flashMessage || "";
    req.session.flashMessage = null;

    const note = await ApiFeatures.query;
    let formattedDate;
    let truncatedText;

    function limitTextWithEllipsis(text, maxLength) {
      if (text.length <= maxLength) {
        return text;
      } else {
        return text.slice(0, maxLength) + "...";
      }
    }

    const arrayNote = await Promise.all(
      Object.keys(note).map(async (key) => {
        formattedDate = moment(note[key].date).format("DD/MM/YYYY HH:mm");

        truncatedTitle = limitTextWithEllipsis(note[key].title, 60);
        truncatedText = limitTextWithEllipsis(note[key].description, 190);

        return {
          _id: note[key]._id,
          title: truncatedTitle,
          description: truncatedText,
          cat_title: note[key].cat_id.title,
          date: note[key].date,
          dateNote: formattedDate,
          sticky: note[key].sticky,
        };
      })
    );

    arrayNote.sort((a, b) => {
      if (a.sticky && !b.sticky) {
        return -1;
      }
      if (!a.sticky && b.sticky) {
        return 1;
      }

      return new Date(b.date) - new Date(a.date);
    });

    res.render("index", {
      title,
      note: arrayNote,
      showSearch: true,
      flashMessage,
    });
  } else {
    res.render("login");
  }
});

exports.Add = catchAsync(async (req, res, next) => {
  const title = "Add note";
  const categories = await Category.find({});

  const categoryOptions = categories.map((category) => ({
    _id: category._id,
    title: category.title,
  }));

  const flashMessage = req.session.flashMessage || "";
  req.session.flashMessage = null;

  res.render("note/add", {
    title: title,
    categories: categoryOptions,
    flashMessage,
  });
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
    res.render("note/add", {
      error: error,
      title: req.body.title,
      description: req.body.description,
    });
  } else {
    const newNote = {
      title: req.body.title,
      description: req.body.description,
      cat_id: req.body.cat_id,
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
  }).then(async (note) => {
    const formattedDate = moment(note.date).format("YYYY-MM-DDTHH:mm");
    if (note.user_id != req.user.id) {
      req.flash("msg_ko", "Reserved area");
      res.redirect("/");
    } else {
      const categories = await Category.find({});

      const categoryOptions = categories.map((category) => ({
        _id: category._id.toString(),
        title: category.title,
      }));

      const flashMessage = req.session.flashMessage || "";
      req.session.flashMessage = null;

      const catIdString = note.cat_id.id.toString();

      res.render("note/edit", {
        note: note.toObject(),
        formattedDate,
        title,
        flashMessage,
        catIdString,
        categories: categoryOptions,
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
    note.date = req.body.date;
    note.save().then((note) => {
      req.flash("msg_ok", "Nota updated");
      res.redirect("/");
    });
  });
});

exports.Delete = catchAsync(async (req, res, next) => {
  const doc = await Note.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }
  const flashMessage = req.session.flashMessage;
  req.session.flashMessage = null;
  res.redirect("/");
});

exports.Sticky = catchAsync(async (req, res, next) => {
  Note.findOne({
    _id: req.params.id,
  }).then((note) => {
    if (req.body.action == "on") {
      note.sticky = true;
    } else {
      note.sticky = false;
    }
    note.save().then((note) => {
      res.status(200).json({
        updated: "ok",
      });
    });
  });
});
