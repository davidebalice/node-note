const User = require("../models/user");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ApiQuery = require("../utils/apiquery");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.Login = catchAsync(async (req, res, next) => {
  const title = "Login";
  res.render("login", { title: title, isLogin: true });
});

exports.Registration = catchAsync(async (req, res, next) => {
  const title = "Registration";
  res.render("registration", { title: title });
});
/*
exports.Access = catchAsync(async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});
*/
exports.Access = catchAsync(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    failureFlash: true;

    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", "Username or password not valid");
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

/*
exports.Index = catchAsync(async (req, res, next) => {
  const title = "Note management";
  res.render("index", { title: title });
});




exports.Info = catchAsync(async (req, res, next) => {
  const title = "Info";
  res.render("info", { title: title });
});

exports.Notes = catchAsync(async (req, res, next) => {
  const ApiFeatures = new ApiQuery(Note.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const note = await ApiFeatures.query;

  const arr = Object.keys(note).map((key) => {
    return {
      _id: note[key]._id,
      title: note[key].title,
      description: note[key].description,
      data: note[key].data,
    };
  });

  res.render("lista_note", { note: arr });
});
*/
