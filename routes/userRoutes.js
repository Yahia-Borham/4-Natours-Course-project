const express = require('express');
const functions2 = require('../controller/userCntroller');
const functions3 = require('../controller/authenticationController');

const userRoutes = express.Router();

userRoutes.route('/signup').post(functions3.signup);
userRoutes.route('/login').get(functions3.login);

userRoutes.use(functions3.autho);

userRoutes.route('/updateUserData').patch(functions2.updateUserData);
userRoutes.route('/updateUserPass').patch(functions2.updateUserPass);
userRoutes.route('/forgetpass').post(functions3.forgetPass);
userRoutes.route('/resetpass/:passtoken').patch(functions3.resetpass);

userRoutes.use(functions3.verifyRole('admin'));

userRoutes.route('/').get(functions2.getAllUsers);
userRoutes.route('/deleteUser').delete(functions2.deleteUser);
userRoutes
  .route('/:id')
  .get(functions2.getOneUser)
  .patch(functions2.updateUser)
  .delete(functions2.deleteUserCompletely);

module.exports = userRoutes;
