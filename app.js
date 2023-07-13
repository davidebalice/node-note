const express = require("express");
const exphbs = require("express-handlebars");
const handlebarsHelpers = require("handlebars-helpers");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const mongoose = require("mongoose");
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");

const { auth } = require("./helpers/auth");

const app = express();

handlebarsHelpers({ exphbs });

app.use("/css", express.static(__dirname + "/public/assets/css"));
app.use("/img", express.static(__dirname + "/public/assets/img"));
app.use("/js", express.static(__dirname + "/public/assets/js"));

require("./config/passport")(passport);
require("./models/note");
require("./models/user");

const User = mongoose.model("User");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(flash());
app.use((req, res, next) => {
  res.locals.msg_ok = req.flash("msg_ok");
  res.locals.msg_ko = req.flash("msg_ko");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

app.use("/", noteRouter);
app.use("/", userRouter);
app.use("/", categoryRouter);

app.post("/registration", (req, res) => {
  let errori = [];
  if (req.body.password != req.body.conferma_psw) {
    errori.push({ text: "password not match" });
  }
  if (req.body.password.length < 6) {
    errori.push({ text: "the password must have at least 6 characters" });
  }
  if (errori.length > 0) {
    res.render("registration", {
      errori: errori,
      nome: req.body.nome,
      cognome: req.body.cognome,
      email: req.body.email,
      password: req.body.password,
      conferma_psw: req.body.conferma_psw,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        req.flash("msg_ko", "this email is already registered");
        res.redirect("/registration");
      } else {
        const newUser = new User({
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("msg_ok", "Registration successfully");
                res.redirect("login");
              })
              .catch((err) => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("msg_ok", "User disconnected");
  res.redirect("/");
});

module.exports = app;
