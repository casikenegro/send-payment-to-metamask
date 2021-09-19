const express = require('express');
const router = express.Router();
const currencyControllers = require('../../controllers/currency');

router.get('/:coin-:currency', currencyControllers.cryptocurrencyPrice);
router.get('/:from_to_:to', currencyControllers.cryptocurrencyConvert);

module.exports = router;