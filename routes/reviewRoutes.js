const express = require('express');

const reviewRoutes = express.Router({ mergeParams: true });
const reviewFunctions = require('./../controller//reviewCntroller');
const functions3 = require('../controller/authenticationController');

reviewRoutes.use(functions3.autho);

reviewRoutes
  .route('/')
  .get(functions3.verifyRole('user'), reviewFunctions.getReviews)
  .post(
    functions3.verifyRole('user'),
    reviewFunctions.checkUserToutIds,
    reviewFunctions.postRview,
  );
reviewRoutes
  .route('/:id')
  .delete(functions3.verifyRole('user', 'admin'), reviewFunctions.deleteReview)
  .patch(functions3.verifyRole('user', 'admin'), reviewFunctions.updateReview)
  .get(
    functions3.autho,
    functions3.verifyRole('user', 'admin'),
    reviewFunctions.getReview,
  );

module.exports = reviewRoutes;
