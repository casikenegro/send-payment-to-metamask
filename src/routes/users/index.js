const express = require("express");
const { body } = require('express-validator');
const userController = require("../../controllers/users");
const middlewares = require("../../middlewares")
const router = express.Router();

//script type pattern
const pattern = /^(USDT|BNB)$/;

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
router.put("/:id" //de usando este formato es mas comodo, para los que consulten tu api, asi no tiene que escribir 
//,                users/update y mandar el id en el body, sino que lo pasan directamente en la url, users/aqwewq12asda
// [
//     body("password").isString(),  estos middleware ya no son necesario,aqui estas obligando al usuario a siempre mandar estos datos para actulizar
//     body("email").isEmail(),       aveces simplemente quiren actualizar el password o el name
//     body("lastname").isString(),
//     body("name").isString(), 
//     middlewares.validateRequest,
    
// ]
,userController.update);
router.delete("/:id", userController.deleteUser);


//User's Script Routes

router.get("/:id", userController.userScripts);
router.post("/:id/script",
//Validation Middlewares.
[
    body("wallet").isString(),
    body("script").isString(),
    body("amount").isNumeric(),
    body("type").if((value) => pattern.test(value)), 
    middlewares.validateRequest,
    
]
, userController.userCreateScript);
router.put("/:id/script", userController.userUpdateScript);
router.delete("/:id/script", userController.userDeleteScript);

module.exports = router