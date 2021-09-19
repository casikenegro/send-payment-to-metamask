import express from 'express';
import userController from '../../controllers/users';
import middlewares from '../../middlewares';

const { body } = require('express-validator');

const router = express.Router();

//patterns
const scriptTypePattern = /^(USDT|BNB)$/;
const buttonColorPattern = /^(blue|grey|green|red|yellow|teal|white|black|none)$/;

//Routes
router.get('/', userController.get);
router.post('/login', userController.login);
router.post('/sign-up',
  [
    body('password').isString(),
    body('email').isEmail(),
    body('lastname').isString(),
    body('name').isString(),
    middlewares.validateRequest,
  ], userController.signUp);
router.put('/:id', userController.update);
router.delete('/:id', userController.deleteUser);

//User's Script Routes
router.get('/:id', userController.getOneUser);

router.post('/:id/script',
  [
    body('wallet').isString(),
    body('amount').isNumeric(),
    body('type').if(value => scriptTypePattern.test(value)),
    middlewares.validateRequest,
  ], userController.userCreateScript);

router.delete('/:id/script/:script_id', userController.userDeleteScript);

//Button Routes
router.get('/:id/button', userController.getButtons);
router.post('/:id/button',
  [
    body('value').isString(),
    body('color').if(value => buttonColorPattern.test(value)),
    middlewares.validateRequest,

  ], userController.createButton);
router.delete('/:id/button/:button_id', userController.deleteButton);

module.exports = router;
