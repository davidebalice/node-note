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
      .sort()
      .limitFields()
      .paginate();

    const note = await ApiFeatures.query;
    let formattedDate;
    const arrayNote = await Promise.all(
      Object.keys(note).map(async (key) => {
        formattedDate = moment(note[key].date).format("DD/MM/YYYY HH:mm");
        /*
        const category = await Category.findById(note[key].cat_id); // Esegui la ricerca sulla collezione "categories" utilizzando l'ObjectId di cat_id
        const title = category ? category.title : ''; // Estrai il titolo dalla categoria se è presente, altrimenti assegna una stringa vuota
        */
        return {
          _id: note[key]._id,
          title: note[key].title,
          description: note[key].description,
          cat_title: note[key].cat_id.title,
          dateNote: formattedDate,
        };
      })
    );
    res.render("index", { title, note: arrayNote, showSearch: true });
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

  res.render("note/add", { title: title, categories: categoryOptions });
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
  }).then((note) => {
    const formattedDate = moment(note.date).format("YYYY-MM-DDTHH:mm");
    if (note.user_id != req.user.id) {
      req.flash("msg_ko", "Reserved area");
      res.redirect("/");
    } else {
      res.render("note/edit", {
        note: note.toObject(),
        formattedDate,
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
    note.date = req.body.date;
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
