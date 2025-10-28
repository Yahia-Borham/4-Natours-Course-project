const express = require('express');
const tourRoutes = express.Router();
const functions1 = require('./../controller/tourCntroller');
const functions3 = require('./../controller/authenticationController');
const reviewRoutes = require('./reviewRoutes');

tourRoutes.use('/tour/:tourId/reviews', reviewRoutes);
tourRoutes.route('/get_tour_stats').get(functions1.get_tour_stats);
tourRoutes
  .route('/monthly_plan/:year')
  .get(
    functions3.autho,
    functions3.verifyRole('admin', 'lead-guide', 'guide'),
    functions1.get_monthly_plan,
  );
tourRoutes
  .route('/gettourswithin/:longlat/distance/:distance/unit/:unit')
  .get(functions1.tours_within);
tourRoutes
  .route('/')
  .get(functions1.get_tour)
  .post(
    functions3.autho,
    functions3.verifyRole('admin', 'lead-guide'),
    functions1.post_tour,
  );
tourRoutes
  .route('/:id')
  .get(functions1.get_specifictour)
  .patch(
    functions3.autho,
    functions3.verifyRole('admin', 'lead-guide'),
    functions1.patch_tour,
  )
  .delete(
    functions3.autho,
    functions3.verifyRole('admin', 'lead-guide'),
    functions1.delete_tour_specific,
  );

module.exports = tourRoutes;
