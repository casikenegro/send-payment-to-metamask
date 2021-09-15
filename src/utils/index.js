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

//Class Script:

class Script {
  constructor(options){
    if (typeof options !== 'object' || options === null) {
      throw new Error('field options must be an object');
    }
    const BNBscript = `<script type="text/javascript">
    window.addEventListener('load', async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
        window.wallets = await window.web3.eth.getAccounts();
        initPayButton();
      } catch (err) {
        $('#status').html('User denied account access', err);
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      initPayButton();
    } else {
      $('#status').html('No Metamask (or other Web3 Provider) installed');
    }
    })
    const initPayButton = async () => {
    $('.pay-button').click(async ()  => {
      const amountUsd = ${options.amount};
      const to = ${options.wallet};
      const from = window.wallets[0];
      const value = window.web3.utils.toWei("",'ether');
      web3.eth.sendTransaction({
        from,
        to,
        value,
      }, (err, transactionId) => {
        if  (err) {
          console.log('Payment failed', err);
          $('#status').html('Payment failed');
        } else {
          console.log('Payment successful', transactionId);
          $('#status').html('Payment successful');
        }
      });
      }
    </script>`;
    const USDTscript = `<script type="text/javascript">
    window.addEventListener('load', async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
        window.wallets = await window.web3.eth.getAccounts();
        initPayButton();
      } catch (err) {
        $('#status').html('User denied account access', err);
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      initPayButton();
    } else {
      $('#status').html('No Metamask (or other Web3 Provider) installed');
    }
    });
    const initPayButton = async () => {
    $('.pay-button').click(async ()  => {
      const amountUsd = ${options.amount};
      const to = ${options.wallet};
      const from = window.wallets[0];
      let tokenAddress = '0x55d398326f99059fF775485246999027B3197955';
      let contractABI = [
        {
          'constant': false,
          'inputs': [
            {
              'name': '_to',
              'type': 'address'
            },
            {
              'name': '_value',
              'type': 'uint256'
            }
          ],
          'name': 'transfer',
          'outputs': [
            {
              'name': '',
              'type': 'bool'
            }
          ],
          'type': 'function'
        }
      ];
      const contract = new window.web3.eth.Contract(contractABI, tokenAddress, {from});
      const amount =  window.web3.utils.toHex();
      const data = await contract.methods.transfer(to,amount).send({
        from,
      });
      console.log(data);
      });
      }
    </script>`;
    this.wallet = options.wallet;
    this.amount = options.amount;
    this.type = options.type;
    this.script = (options.type === 'BNB')? BNBscript.replace(/[\n\s]/g, ''): USDTscript.replace(/[\s\n]/g, '');
  }
}


module.exports = { refreshToken, generateToken, generateScript, Script}