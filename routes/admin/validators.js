const { check } = require('express-validator');
const Admin 	= require("../../models/admin");

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1'),
  requireUsername: check('username')
    .trim()
	.isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters')
    .custom(async username => {
     const existingUser = await Admin.findOne({username}).exec();
		if(existingUser){
			throw new Error("Username in use");
		}
      
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom(async (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      }
    }),
  requireUsernameExists: check('username')
    .trim()
    .custom(async username => {
      const user = await Admin.findOne({username}).exec();
      if (!user) {
        throw new Error('Username not found!');
      }
    })
 
};
