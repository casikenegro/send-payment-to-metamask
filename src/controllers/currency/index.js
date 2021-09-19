const utils = require('../../utils');

const cryptocurrencyPrice = async (req, res) => {
    try {
        const price = await utils.getPrice({coin: req.params.coin,currency: req.params.currency});
        return res.status(200).json({message: 'success', price});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

const cryptocurrencyConvert = async (req, res) => {
    try {
        const result = await utils.convertCurrency({from: req.params.from, to: req.params.to, amount: req.query.amount});
        return res.status(200).json({message: 'success', result});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

module.exports = {
    cryptocurrencyPrice,
    cryptocurrencyConvert
}