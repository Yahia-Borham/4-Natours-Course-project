const Reviews = require("./../modules/reviewmodel");
const Users = require("./../modules/usersmodule");
const Tour = require("./../modules/tourmodule");
const Upgradederror = require("../utilities/apperror");
const factoryFunctions = require("./factoryFunctions");

const getReview = factoryFunctions.getOneThing(Reviews);

const checkUserToutIds = async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const postRview = factoryFunctions.createThings(Reviews);
const deleteReview = factoryFunctions.deleteOneThing(Reviews);
const updateReview = factoryFunctions.updateOneThing(Reviews);
const getReviews = factoryFunctions.getManyThings(Reviews);

module.exports = {
  getReviews: getReviews,
  postRview: postRview,
  deleteReview: deleteReview,
  updateReview: updateReview,
  checkUserToutIds: checkUserToutIds,
  getReview: getReview,
};
