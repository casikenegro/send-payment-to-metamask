const jwt = require('jsonwebtoken');
const {secretTokenKey,expiresIn} = require('../constants');

const changeScript = (amountUsd,to) => {

}


const refreshToken = (token)=>{
  const decoded = jwt.verify(token, secretTokenKey);
  return jwt.sign({ ...decoded},secretTokenKey,{
    expiresIn,
  });
}
const generateToken = (id)=> {
    return jwt.sign({ id },secretTokenKey,{
        expiresIn // 24 hours
      })
}

module.exports = { refreshToken, generateToken}