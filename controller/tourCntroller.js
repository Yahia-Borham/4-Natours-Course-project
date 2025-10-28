const { json } = require("stream/consumers");
const Tour = require("../modules/tourmodule");
const APIFeatures = require("../utilities/apiFeatures");
const Upgradederror = require("../utilities/apperror");
const factoryFunctions = require("./factoryFunctions");
const { match } = require("assert");
const { Error } = require("mongoose");
const catchasync = require("./../utilities/catchAsync");

const get_tour = factoryFunctions.getManyThings(Tour);
const get_specifictour = factoryFunctions.getOneThing(Tour, {
  path: "reviews",
});
const post_tour = factoryFunctions.createThings(Tour);
const patch_tour = factoryFunctions.updateOneThing(Tour);
const delete_tour_specific = factoryFunctions.deleteOneThing(Tour);

const get_tour_stats = catchasync(async (req, res, next) => {
  const statistic = await Tour.aggregate([
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        avgprice: { $avg: "$price" },
        maxxprice: { $max: "$price" },
        minprice: { $min: "$price" },
        avgratings: { $avg: "$ratingsAverage" },
        totalratings: { $sum: "$ratingsQuantity" },
        totaltours: { $sum: 1 },
      },
    },
    {
      $sort: {
        avgratings: -1,
      },
    },
  ]);

  console.log(statistic);

  res.status(200).json({
    status: "succes",
    data: statistic,
  });
});

const get_monthly_plan = catchasync(async (req, res, next) => {
  const year = req.params.year * 1;

  const statistic = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        tournames: { $push: "$name" },
        numbers: { $sum: 1 },
      },
    },
    {
      $limit: 1,
    },
  ]);

  res.status(200).json({
    status: "succes",
    data: { statistic },
  });
});

const tours_within = async (req, res) => {
  const { longlat, distance, unit } = req.params;
  let distance1 = distance * 1;
  const [lat, long] = longlat.split(",");
  const radius = unit === "mi" ? distance1 / 3963 : distance1 / 6378;

  const available_tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.status(200).json({
    status: "succes",
    Locations: available_tours,
  });
  console.log(long, lat, radius);
};

module.exports = {
  get_tour: get_tour,
  get_specifictour: get_specifictour,
  post_tour: post_tour,
  patch_tour: patch_tour,
  delete_tour_specific: delete_tour_specific,
  get_tour_stats: get_tour_stats,
  get_monthly_plan: get_monthly_plan,
  tours_within: tours_within,
};
