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
