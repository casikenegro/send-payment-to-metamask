const express = require('express');
const router = express.Router();
const constants = require('../../constants');
const utils = require('../../utils');
const querystring = require('querystring');

router.get('/', (req, res) => {
    res.send('<html><head><title>change example</title><meta content=""><link rel="stylesheet" href="change.css"></head>'+
             '<body><header><h1>Example</h1></header><form action="" method="post" class="form-example">'+
             '<div class="form-example"><label for="amount">amount: </label><input type="number" name="amount" id="amount" required>'+
             '</div><div class="form-example"><label for="addressee">addressee: </label><input type="text" name="addressee" id="addressee" required>'+
             '</div><div class="form-example"><input type="submit" value="submit"></div></form></body></html>')
});

router.post('/', (req, res) => {
    processBody(req, res);
});


function processBody(req, res){
    let body = '';
    req.on('data', (data) => {
        body += data;
    });
    req.on('end', () => {
        var form = querystring.parse(body);
        console.log(`${constants.scriptPaymentUSDT.replace("const amountUsd = ''; // change", `const amountUsd = ${form.amount};`).replace("const to = ''; // change", `const to = ${form.addressee};`)}`);
        res.send('successful operation');
    });
};

module.exports = router;