const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
const TraderUtils = require('../utils/TraderUtils');
const trader = new TraderUtils();
router.post('/', async(req,res) => {
    const parsedTrader= JSON.parse(JSON.stringify(req.body));
    console.log(parsedTrader);
    trader.addTrader(parsedTrader).then((resp) => {
        if(resp){
            return res.status(201).send({
                message: "Trader created",
                value: resp
            });
        }
        return res.status(400).send({
            message:"trader not created",
            value: resp
        });
    })
        
})

module.exports =  router;