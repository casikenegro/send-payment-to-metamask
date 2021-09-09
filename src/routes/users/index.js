const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    return res.send({message:"i am user "});
})

module.exports = router