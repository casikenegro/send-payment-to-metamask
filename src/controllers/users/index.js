const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");
const {  UserModel } = require("../../db");
const utils = require("../../utils");

const getAll = async (req,res) => {
    try {
        const user = await UserModel.find({});
        return res.send(user);
    } catch (error) {
        return res.status(500).send(error);
    }
}
const login = async (req,res) => {
    try {
        const { email ,password } = req.body
        const user = await UserModel.findOne({ where: {email} } );
        if(!user)  return res.status(404).send({message:"User not exist"});
        if(bcrypt.compareSync(password,user.password)){
          delete user.dataValues.password;
          return res.status(200).send({
            user, 
            token: utils.generateToken(user.id),
          });
        }
        return res.status(403).send({message:"Forbidden"});
      } catch (error) {
        return res.status(500).json(error);
    }
}

const singUp = async (req,res) => {
    try {
      req.body.password = bcrypt.hashSync(req.body.password,10);
      const userExist = await UserModel.findOne({ email: req.body.email });
      if(userExist){
        return res.status(401).json({message: 'email exist' })
      }
      const user = await UserModel.create({
          ...req.body, 
      });
      return res.send({
        user,
        token: utils.generateToken(user.id),
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  
  }
  
  async function recover_password(req,res){
    try {
      if(req.recoveryCode != process.env.RECOVERY_CODE)
        res.status(401).json({message: "invalid recuperation code"})
      const user  = await UserModel.findOne({ email:req.body.email });
      if(!user){
        res.status(422).json({message: "user no exist"});
      }
      const password = bcrypt.hashSync(req.body.password,10)
      await UserModel.update({password},{id : user.id });
      return res.status(200).json({message: "success"});
    } catch (e) {
      res.status(500).json({message: "Ha ocurrido un error, contacte con soporte"})
    }
  }

module.exports =  {
    login, 
    singUp,
    getAll
}