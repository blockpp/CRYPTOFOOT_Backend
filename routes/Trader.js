const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
const TraderUtils = require('../utils/TraderUtils');
const trader = new TraderUtils();
router.post('/', async(req,res) => {
    await trader.addTrader(req.body).then((resp) => {
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