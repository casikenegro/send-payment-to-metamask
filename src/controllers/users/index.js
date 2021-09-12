const bcrypt = require('bcrypt');
const {  UserModel, ScriptModel } = require("../../db");
const utils = require("../../utils");

const getAll = async (req,res) => {
    try {
        const user = await UserModel.find({});
        return res.json(user);
    } catch (error) {
        return res.status(500).send(error);
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
    //var user = await UserModel.findById(req.body.id); usar var en una funcion de este tipo,no es recomendable, investiga sobre el scope en js 
    let user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: "User does not exist"});
    }
//    var userUdated = Object.assign(user, req.body); esto no es necesario, investiga sobre spread operator
//   await UserModel.updateOne({ _id: req.body.id }, userUdated); si arriba ya tienes el objecto no es necesario volver hacer otra petcion, solo actulizalo directamente
    user.set({...req.body});
    console.log(user);
    await user.save();
    return res.status(200).json({message: "success", user}); //siempre es buena practica retornar el objecto;
  } catch (e) {
    res.status(500).json({message: "Error"});
  }
}

const deleteUser = async (req, res) => {
  try {
  //  await UserModel.findByIdAndDelete(req.params.id); // a esto le falta validar;
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).send({message: "User does not exist"});
  }
  await user.delete();
  return res.status(200).json({message: "user deleted successfully"});
  } catch (e) {
    res.status(500).json({message: "Error"});
  }
}

const userScripts = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id); //recuerda no usar var, ya las cambie por const
    if(!user) return res.status(404).json({message: "user not found"});
    const scripts = await ScriptModel.find({user: user}); // users es una llave foranea puede existir mas de 1 script
    //if(!scripts) return res.status(404).json({message: "user's scripts not found"}); no es necesario
   // return res.status(200).json({wallet: scripts.wallet, script: scripts.script}); siempre tienes que mandar la mayor cantidad de informacion posible, si no te piden restriccion
    return res.json({
      ...user._doc,
      ...scripts,
    })
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
}

const userCreateScript = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const script = await ScriptModel.create({...req.body});
    return res.status(200).json({message: "success", script});
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
}

const userUpdateScript = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    const script = await ScriptModel.findOne({user: user});
    script.set({...req.body});
    await script.save();
    return res.status(200).json({message: "successfully updated", script});
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
}

const userDeleteScript = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(404).json({message: "user not found"});
    await ScriptModel.findOneAndDelete({user: user});
    return res.status(200).json({message: "successfully deleted"});
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
    userScripts,
    userCreateScript,
    userUpdateScript,
    userDeleteScript
}