const jwt = require('jsonwebtoken');
const {
  secretTokenKey,
  expiresIn,
  cryptocurrenciesIDs,
  supportedCurrencies,
} = require('../constants');

const urlApi = 'https://api.coingecko.com/api/v3';
const https = require('https');

const refreshToken = (token) => {
  const decoded = jwt.verify(token, secretTokenKey);
  return jwt.sign({ ...decoded }, secretTokenKey, {
    expiresIn,
  });
};
const generateToken = (id) => {
  return jwt.sign({ id }, secretTokenKey, {
    expiresIn, // 24 hours
  });
};

//Class Script:

class Script {
  constructor(options) {
    if (typeof options !== 'object' || options === null) {
      throw new Error('field options must be an object');
    }
    const BNBscript = `<script type='text/javascript'>
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
    const USDTscript = `<script type='text/javascript'>
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
    this.script =
      options.type === 'BNB' ?
        BNBscript.replace(/[\n]/g, '') :
        USDTscript.replace(/[\n]/g, '');
  }
}

//Function: generateButton

const generateButton = (type, color, value) => {
  const colors = {
    blue: 'btn btn-primary',
    grey: 'btn btn-secondary',
    green: 'btn btn-success',
    red: 'btn btn-danger',
    yellow: 'btn btn-warning',
    teal: 'btn btn-info',
    white: 'btn btn-light',
    black: 'btn btn-dark',
    none: 'btn btn-link',
    outline_blue: 'btn btn-outline-primary',
    outline_grey: 'btn btn-outline-secondary',
    outline_green: 'btn btn-outline-success',
    outline_red: 'btn btn-outline-danger',
    outline_yellow: 'btn btn-outline-warning',
    outline_teal: 'btn btn-outline-info',
    outline_white: 'btn btn-outline-light',
    outline_blac: 'btn btn-outline-dark',
  };
  return `<button type="${type}" class="${colors[color]}">${value}</button>`;
};

//Function getPrice:

//function to get the price of a cryptocurrency in a given currency.

const getPrice = (options) => {
  if (typeof options !== 'object' || options === null) {
    throw new Error('field options must be an object');
  }
  if (!options.currency) options.currency = 'usd';
  let parsedData;
  const url = new URL(`${urlApi}/simple/price`);
  url.search = new URLSearchParams({
    ids: cryptocurrenciesIDs[options.coin],
    vs_currencies: options.currency,
  });

  //client request to the api to get the price
  const request = https
    .get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      let error;
      if (statusCode !== 200) {
        error = new Error(`request failed. status code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(
          `invalid content-type. expected application/json but received ${contentType}`,
        );
      }
      if (error) {
        console.error(error.message);
        res.resume();
        return;
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          parsedData = JSON.parse(rawData);
        } catch (e) {
          console.error(e.message);
        }
      });
    })
    .on('error', (e) => {
      console.error(e.message);
    });
  return parsedData[url.searchParams.get('ids')][options.currency];
};

//Function convertCurrency:

//convert the value of a currency to another and return it.

const convertCurrency = (options) => {
  if (supportedCurrencies.includes(options.from)) {
    const cryptoPrice = getPrice({ coin: options.to, currency: options.from });
    const converted = (1 / cryptoPrice) * options.amount;
    return `${converted} ${options.to}`;
  }
  const cryptoPrice = getPrice({ coin: options.from, currency: options.to });
  const converted = cryptoPrice * options.amount;
  return `${converted} ${options.to}`;

};

module.exports = {
  refreshToken,
  generateToken,
  Script,
  generateButton,
  getPrice,
  convertCurrency,
};
