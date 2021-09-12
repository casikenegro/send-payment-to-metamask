const jwt = require('jsonwebtoken');
const {secretTokenKey,expiresIn, scriptPaymentUSDT , scriptPaymentBNB } = require('../constants');

const generateScript = (amountUsd,to,type) => {
  let text = (type === "USDT") ? scriptPaymentUSDT : scriptPaymentBNB;
  return text
    .replace("const amountUsd = ''; // change", `const amountUsd = ${amountUsd};`)
    .replace("const to = ''; // change", `const to = ${to};`);
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