const { validationResult } = require('express-validator');

const validateRequest = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json(errors);
    }
    next();
}

module.exports = {
    validateRequest
};