const Category = require("../models/category");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ApiQuery = require("../utils/apiquery");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const moment = require("moment");

exports.Show = catchAsync(async (req, res, next) => {
  const title = "Category";
  if (req.user.id) {
    const userId = req.user.id;
    const ApiFeatures = new ApiQuery(
      Category.find({ user_id: { $eq: userId } }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const category = await ApiFeatures.query;

    const arr = Object.keys(category).map((key) => {
      return {
        _id: category[key]._id,
        title: category[key].title,
      };
    });

    arr.sort((a, b) => a.title.localeCompare(b.title));

    res.render("category/category", { title, category: arr });
  } else {
    res.render("login");
  }
});

exports.Add = catchAsync(async (req, res, next) => {
  const title = "Add category";
  res.render("category/add", { title: title });
});

exports.Store = catchAsync(async (req, res, next) => {
  let error = [];
  if (!req.body.title) {
    error.push({ text: "Enter title" });
  }
  if (error.length > 0) {
    res.render("category/add", {
      error: error,
      title: req.body.title,
    });
  } else {
    const newCategory = {
      title: req.body.title,
      user_id: req.user.id,
    };
    new Category(newCategory).save().then((cat) => {
      req.flash("msg_ok", "Category added");
      res.redirect("/categories");
    });
  }
});

exports.Edit = catchAsync(async (req, res, next) => {
  const title = "Edit category";
  await Category.findOne({
    _id: req.params.id,
  }).then((category) => {
    if (category.user_id != req.user.id) {
      req.flash("msg_ko", "Reserved area");
      res.redirect("/");
    } else {
      res.render("category/edit", {
        category: category.toObject(),
        title,
      });
    }
  });
});

exports.Update = catchAsync(async (req, res, next) => {
  Category.findOne({
    _id: req.params.id,
  }).then((category) => {
    category.title = req.body.title;
    category.save().then((category) => {
      req.flash("msg_ok", "Nota updated");
      res.redirect("/categories");
    });
  });
});

exports.Delete = catchAsync(async (req, res, next) => {
  Category.deleteOne({
    _id: req.params.id,
  }).then(() => {
    req.flash("msg_ok", "Category deleted");
    res.redirect("/categories");
  });
});
