const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/user");
const User = mongoose.model("User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      console.log(email);
      User.findOne({
        email: email,
      })
        .then((user) => {
          console.log(user);
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          console.log(user);
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            console.log(err);
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password not correct" });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  /*
  User.deserializeUser(function (id, done) {
    Utenti.findById(id, function (err, user) {
      done(err, user);
    });
  });
*/
  passport.deserializeUser(async function (id, done) {
    const user = await User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, user);
      });
  });
};
