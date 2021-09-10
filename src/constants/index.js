const scriptPaymentBNB = ` <script type="text/javascript">
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
    const to = '';
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

const key =  "llaveUltraSecreta";
module.exports = {
  key
}