const { User, register } = require("../models/user");

module.exports.registerPost = (req, res) => {
  res.render("users/register");
};
module.exports.registerPost = async (req, res) => {
  try {
    const { username, email, password } = req.body();
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Fitfinity!");
      res.redirect("/journal");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
module.exports.login = (req, res) => {
  res.render("users/login");
};
module.exports.loginPost = (req, res) => {
  req.flash("success", "welcome back");
  console.log(res.locals.returnTo);
  const redirectUrl = res.locals.returnTo || "/Home";
  res.redirect(redirectUrl);
};
