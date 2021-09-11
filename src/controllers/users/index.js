const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");
const {  UserModel, ScriptModel } = require("../../db");
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

const signUp = async (req,res) => {
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

const update = async (req, res) => {
  try {
    if(req.body.password){
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    var user = await UserModel.findById(req.body.id);
    if (!user) {
      return res.status(404).send({message: "User does not exist"});
    }
    var userUdated = Object.assign(user, req.body);
    await UserModel.updateOne({ _id: req.body.id }, userUdated);
    return res.status(200).json({message: "success"});
  } catch (e) {
    res.status(500).json({message: "Error"});
  }
}

const deleteUser = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.body.id);
    return res.status(200).json({message: "user deleted successfully"});
  } catch (e) {
    res.status(500).json({message: "Error"});
  }
}

const scripts = async (req, res) => {
  try {
    var user = await UserModel.findById(req.body.id);
    if(!user) return res.status(404).json({message: "user not found"});
    var scripts = await ScriptModel.findOne({user: user});
    if(!scripts) return res.status(404).json({message: "user's scripts not found"});
    return res.status(200).json({wallet: scripts.wallet, script: scripts.script});
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
}

module.exports =  {
    login, 
    signUp,
    getAll,
    update,
    deleteUser,
    scripts
}