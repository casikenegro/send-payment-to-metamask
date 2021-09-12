const jwt = require('jsonwebtoken');
const {secretTokenKey,expiresIn, scriptPaymentUSDT , scriptPaymentBNB } = require('../constants');

const generateScript = (payload,_id) => {
  let text = (payload.type === "USDT") ? scriptPaymentUSDT : scriptPaymentBNB;
  text.replace("const amountUsd = ''; // change", `const amountUsd = ${payload.amount};`)
    .replace("const to = ''; // change", `const to = ${payload.wallet};`);
  return {
    script: text, 
    ...payload, 
    user: _id
  };
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

module.exports = { refreshToken, generateToken, generateScript}