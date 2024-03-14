const { JournalEntry } = require("./models/journal");
const { Review } = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
// module.exports.isAuthor = async (req, res, next) => {
//   const { id } = req.params;
//   const review = await JournalEntry.findById(id);
//   if(!review.authors.equal(req.user._id)){
//     return res.
//   }
// };
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    //throw new ExpressError(msg,404)
  } else {
    next();
  }
};
module.exports.reviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  console.log(reviewid);
  const review = await Review.findById(reviewid);
  console.log(review);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    // return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
