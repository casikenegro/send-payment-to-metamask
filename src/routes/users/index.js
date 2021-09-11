const express = require("express");
const { body } = require('express-validator');
const userController = require("../../controllers/users");
const middlewares = require("../../middlewares")
const router = express.Router();

router.get("/",userController.getAll);
router.post("/login",userController.login);
router.post("/sing-up",
//add middlewares
[
    body("password").isString(),
    body("email").isEmail(),
    body("lastname").isString(),
    body("name").isString(), 
    middlewares.validateRequest,
    
]
,userController.singUp);


module.exports = router