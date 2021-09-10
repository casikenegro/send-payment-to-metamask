const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users");
router.get("/",(req,res)=>{
    return res.send({message:"i am user "});
})
router.post("/login",)
module.exports = router