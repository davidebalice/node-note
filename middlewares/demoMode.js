const demo = require("../config/demo");

const demoMode = (req, res, next) => {
  if (demo === true) {
    req.session.flashMessage =
      "Demo mode active. CRUD operations are not allowed.";
    res.redirect("back");
  } else {
    next();
  }
};

module.exports = demoMode;
