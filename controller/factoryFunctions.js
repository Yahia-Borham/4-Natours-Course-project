const Upgradederror = require("../utilities/apperror");
const APIFeatures = require("./../utilities/apiFeatures");

const deleteOneThing = (module) => async (req, res, next) => {
  const deletedData = await module.findByIdAndDelete(req.params.id);
  if (!deletedData) return next(Upgradederror("plz enetr a valied id", 404));
  res.status(204).json({
    status: "succes",
    Data: deletedData,
  });
};

const updateOneThing = (Model) => async (req, res, next) => {
  const updatedData = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedData)
    return next(
      new Upgradederror(`the id ${req.params.id} is invalied`, "404"),
    );

  res.status(200).json({
    status: "succes",
    updatedData: updatedData,
  });
};

const createThings = (Model) => async (req, res, next) => {
  const postedTour = await Model.create(req.body);
  res.status(201).json({
    staus: "succes",
    postedData: postedTour,
  });
};

const getOneThing = (Model, popOptions) => async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new Upgradederror("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};

const getManyThings = (Model) => async (req, res, next) => {
  const features = new APIFeatures(Model.find(), req.query);
  features.filter();
  features.sort();
  features.select();
  features.pagination();
  const allThings = await features.query;

  if (!allThings) {
    return next(new Upgradederror("cann't get the data", 404));
  }

  res.status(200).json({
    status: "succuse",
    Data: allThings,
  });
};

module.exports = {
  deleteOneThing: deleteOneThing,
  updateOneThing: updateOneThing,
  createThings: createThings,
  getOneThing: getOneThing,
  getManyThings: getManyThings,
};
