const bcrypt = require('bcrypt');
const {  UserModel, ScriptModel, ButtonModel } = require("../../db");
const utils = require("../../utils");
const {Script} = require("../../utils");

//users controllers

const get = async (req,res) => {
  try {
    const user = await UserModel.find();
    return res.json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
}

const getOneUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const scripts = await ScriptModel.find({user : user._id});
    return res.json({
      ...user._doc,
      scripts: scripts
    })
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
}

const login = async (req,res) => {
    try {
        const { email ,password } = req.body
        const user = await UserModel.findOne({ where: {email} } );
        if(!user)  return res.status(404).json({message:"User not exist"});
        if(bcrypt.compareSync(password,user.password)){
          delete user.dataValues.password;
          return res.status(200).json({
            user, 
            token: utils.generateToken(user.id),
          });
        }
        return res.status(403).json({message:"Forbidden"});
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
  
  // async function recover_password(req,res){
  //   try {
  //     if(req.recoveryCode != process.env.RECOVERY_CODE)
  //       res.status(401).json({message: "invalid recuperation code"})
  //     const user  = await UserModel.findOne({ email:req.body.email });
  //     if(!user){
  //       res.status(422).json({message: "user no exist"});
  //     }
  //     const password = bcrypt.hashSync(req.body.password,10)
  //     await UserModel.update({password},{id : user.id });
  //     return res.status(200).json({message: "success"});
  //   } catch (e) {
  //     res.status(500).json({message: "Ha ocurrido un error, contacte con soporte"})
  //   }
  // }

const update = async (req, res) => {
  try {
    if(req.body.password){
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    let user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: "User does not exist"});
    }
    user.set({...req.body});
    await user.save();
    return res.status(200).json({message: "success", user}); 
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

const deleteUser = async (req, res) => {
  try {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).send({message: "User does not exist"});
  }
  await ScriptModel.deleteMany({user: user._id});
  await user.delete();
  return res.status(200).json({message: "user successfully deleted"});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}


// users - scripts

const userCreateScript = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const userScript = new Script({...req.body});
    const script = await ScriptModel.create({...userScript, user: user._id});
    return res.status(200).json({message: "success", ...script._doc});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
}

const userDeleteScript = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const script = await ScriptModel.findById(req.params.script_id);
    if(!script) return res.status(404).json({message: "script not found"});
    await script.delete();
    return res.status(200).json({message: "successfully deleted"});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
}



// users - button

const getButtons = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const button = await ButtonModel.find({user: user._id});
    if(!button) return res.status(404).json({message: "button not found"});
    return res.status(200).json({message: "button found", ...button});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
};

const createButton = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const script = await ScriptModel.findOne({user: req.body.script_id});
    if(!script) return res.status(404).json({message: "script not found"});
    const button = await ButtonModel.create({
      ...req.body, 
      buttonScript: utils.generateButton(req.body.type, req.body.color, req.body.value),
      user: user._id, 
      scripts: script._id
    });
    return res.status(200).json({message: "button successfully created", ...button._doc});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
};

const deleteButton = async (req ,res) =>{
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const button = await ButtonModel.findById(req.params.button_id);
    if(!button) return res.status(404).json({message: "button not found"});
    await button.delete();
    return res.status(200).json({message: "successfully deleted"});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
};


module.exports =  {
    login, 
    signUp,
    get,
    update,
    deleteUser,
    getOneUser,
    userCreateScript,
    userDeleteScript,
    getButtons,
    createButton,
    deleteButton
}