const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config();

// https://www.paymee.tn/swagger.html#tag/Payments/operation/post-api-v1-payments-create


async function connectToPaymee(amount) {
    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.PAYMEE_API_TOKEN}`
    };
    const requestBody = {
        amount: amount,
        note: "this is a payment",
        first_name: "yassine",
        last_name: "makhlouf",
        email: "yassinemakhmlouf5@gmail.com",
        phone: "+21652486269",
        return_url: "https://localhost:3443/paymee/return",
        cancel_url: "https://localhost:3443/paymee/cancel",
        webhook_url: "https://localhost:3443/paymee/webhook"
    };

    try {
        const result = await fetch(process.env.PAYMEE_SANDBOX_API, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(requestBody)
        });
        return await result.json();
    } catch(err) {
        console.log('paymee server is down');
        return null;
    }
}

async function checkPayment(paymentToken) {
    const url = `https://sandbox.paymee.tn/api/v2/payments/${paymentToken}/check`;
    const headers = { 'Authorization': `Token ${process.env.PAYMEE_API_TOKEN}` };
    try {
        return await fetch(url, { headers });
    } catch(err) {
        console.log('paymee server is down');
        return null;
    }
}

async function addTokens(amount) {
    const contractAddress = '0xE4c5FEa6c10020F34B8134738a44b6a4791fF8cE';
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
    const abi = JSON.parse(fs.readFileSync('../abi/contracts/OlympCoin.sol/OlympCoin.json', 'utf8')).abi;
    const contract = new ethers.ethers.Contract(contractAddress, abi, provider.getSigner());

    console.log('before transfer :');
    console.log(Number(await contract.balanceOf(process.env.PRIVATE_KEY)));
    await contract.transfer(process.env.PRIVATE_KEY, amount * 10 ** 18);
    console.log('after transfer :');
    console.log(Number(await contract.balanceOf(process.env.PRIVATE_KEY)));
}

// this request should come from the frontend
router.post('/', async (req, res) => {
    const amount = req.body.amount;
    const response = await connectToPaymee(amount);
    if(response !== null) {
        res.redirect(response.data.payment_url);
    }
});

router.get('/return', async (req, res) => {
    const response = await checkPayment(req.query.payment_token);
    if(response !== null) {
        const payment = await response.json();
        const url = `http://localhost:3001/paymentStatus/?payment_status=${payment.data.payment_status}&amount=${payment.data.amount}`;
        // await addTokens(amount); this function needs to be changed or fixed or completed
        res.redirect(url);
    }
})

router.get('/cancel', (req, res) => {
    res.redirect('http://localhost:3001');
})

module.exports = router;
