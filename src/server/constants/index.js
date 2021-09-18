const scriptPaymentBNB = `<script type="text/javascript">
window.addEventListener('load', async () => {
if (window.ethereum) {
  window.web3 = new Web3(ethereum);
  try {
    await ethereum.enable();
    window.wallets = await window.web3.eth.getAccounts();
    initPayButton()
  } catch (err) {
    $('#status').html('User denied account access', err)
  }
} else if (window.web3) {
  window.web3 = new Web3(web3.currentProvider)
  initPayButton()
} else {
  $('#status').html('No Metamask (or other Web3 Provider) installed')
}
})
const initPayButton = async () => {
$('.pay-button').click(async ()  => {
  const amountUsd = ''; // change
  const to = ''; // change
  const from = window.wallets[0] // your wallet
  //paytment in BNB or ether
  const value = window.web3.utils.toWei("",'ether');
  web3.eth.sendTransaction({
    from,
    to,
    value,
  }, (err, transactionId) => {
    if  (err) {
      console.log('Payment failed', err)
      $('#status').html('Payment failed')
    } else {
      console.log('Payment successful', transactionId)
      $('#status').html('Payment successful')
    }
  })
  }
</script>`;

const scriptPaymentUSDT = `<script type="text/javascript">
window.addEventListener('load', async () => {
if (window.ethereum) {
  window.web3 = new Web3(ethereum);
  try {
    await ethereum.enable();
    window.wallets = await window.web3.eth.getAccounts();
    initPayButton()
  } catch (err) {
    $('#status').html('User denied account access', err)
  }
} else if (window.web3) {
  window.web3 = new Web3(web3.currentProvider)
  initPayButton()
} else {
  $('#status').html('No Metamask (or other Web3 Provider) installed')
}
})
const initPayButton = async () => {
$('.pay-button').click(async ()  => {
  const amountUsd = ''; // change
  const to = ''; // change
  const from = window.wallets[0] // your wallet
  // -- send USTD
  let tokenAddress = '0x55d398326f99059fF775485246999027B3197955' // HST contract address
  let contractABI = [
    // transfer
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
  ]

  const contract = new window.web3.eth.Contract(contractABI, tokenAddress, {from})
  const amount =  window.web3.utils.toHex()
  const data = await contract.methods.transfer(to,amount).send({
    from,
  })
    console.log(data);
      })
      }
</script>`
const secretTokenKey = '$2b$10$XFmi3kESU9RnXRxPdirPHu3djkdmOO8nmxcl1cT.ilq3s07ybU0dS';
const expiresIn = '3h';
module.exports = {
  secretTokenKey,
  expiresIn,
  scriptPaymentUSDT, 
  scriptPaymentBNB,
}