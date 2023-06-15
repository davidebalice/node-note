module.exports = {
  auth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("msg_errore", "Non puoi entrare, mi dispiace");
    res.redirect("/login");
  },
};
