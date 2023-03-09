const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
const TraderUtils = require('../utils/TraderUtils');
const trader = new TraderUtils();

router.get('/', async(req,res) => {
    trader.getAllTrader().then((resp) => {
        console.log(resp, "response");
        if(!resp){
            return res.status(404).send({
                message: "No traders yet",
                value : resp,
            });
        }else if (resp == null){
            return res.status(500).send("server error");
        }else {
            return res.status(200).send({
                message: "traders found",
                value: JSON.parse(JSON.stringify(resp)),
            });
        }
    }).catch((error) => {
        console.log(error)
        return res.status(502).send("bad gateway");
    });
});

router.get('/', async(req, res) => {
    const id = req.query.id.toString();
    await trader.getTraderById(id).then((resp) => {
        if(!resp) {
            return res.status(404).send({
                message: "trader not found",
                value: resp
            });
        }else if (resp == null ){
            return res.status(500).send("server error");
        }
        return res.status(200).send({
            message: "trader found",
            value: resp
        });
    }).catch((error) => {
        console.log(error);
        return res.status(502).send("bad gateway");
    });
});

router.get('/', async(req,res) => {
    const email = req.query.email;
    await traider.getTraderByEmail(email).then((resp) => {
        if(!resp) return res.status(404).send({
            message: "trader with this "+email+"not found",
            value: resp,
        });
        else if (resp == null) return res.status(500).send({
            message: "server error",
            value : resp,
        });
        else return res.status(200).send({
            message: "trader found",
            value: resp
        });
    }).catch((err) => {
        console.log(err);
        return res.status(502).send("bad gateway");
    })
})
router.post('/', async(req,res) => {
    const parsedTrader= JSON.parse(JSON.stringify(req.body));
    await trader.addTrader(parsedTrader).then((resp) => {
        if(resp){
            return res.status(201).send({
                message: "Trader created",
                value: resp
            });
        }
        if (!resp) {
            return res.status(400).send({
                message:"trader not created",
                value: resp
            });
        }else {
            return res.status(500).send({
                message:"server error",
                value: resp
            });
        }
    }).catch((err) => {
        console.log(err, "502 bad gateway error");
        return res.status(502).send("bad gateway");
    })
        
})

module.exports =  router;