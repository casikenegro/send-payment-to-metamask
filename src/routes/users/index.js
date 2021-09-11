const express = require("express");
const { body } = require('express-validator');
const userController = require("../../controllers/users");
const middlewares = require("../../middlewares")
const router = express.Router();

router.get("/",userController.getAll);
router.post("/login",userController.login);
router.post("/sign-up",
//add middlewares
[
    body("password").isString(),
    body("email").isEmail(),
    body("lastname").isString(),
    body("name").isString(), 
    middlewares.validateRequest,
    
]
,userController.signUp);
router.put("/update",
[
    body("password").isString(),
    body("email").isEmail(),
    body("lastname").isString(),
    body("name").isString(), 
    middlewares.validateRequest,
    
]
,userController.update);
router.delete("/delete", userController.deleteUser);
router.get("/scripts", userController.scripts);

module.exports = router