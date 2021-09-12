const express = require("express");
const { body } = require('express-validator');
const userController = require("../../controllers/users");
const middlewares = require("../../middlewares")
const router = express.Router();

//script type pattern
const pattern = /^(USDT|BNB)$/;

router.get("/",userController.get);
router.post("/login",userController.login);
router.post("/sign-up",
[
    body("password").isString(),
    body("email").isEmail(),
    body("lastname").isString(),
    body("name").isString(), 
    middlewares.validateRequest,
    
]
,userController.signUp);
router.put("/:id" ,userController.update);
router.delete("/:id", userController.deleteUser);


//User's Script Routes
router.get("/:id", userController.getOneUser);

router.post("/:id/script",
[
    body("wallet").isString(),
    body("amount").isNumeric(),
    body("type").if((value) => pattern.test(value)), 
    middlewares.validateRequest,
], userController.userCreateScript);

router.delete("/:id/script/:script_id", userController.userDeleteScript);

module.exports = router