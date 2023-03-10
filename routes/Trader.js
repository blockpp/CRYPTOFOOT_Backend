var express = require('express');
const Trader = require('../models/Trader');
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
        
});

router.post('/search',async(req , res) => {
    let query = {}
    const parsedquery= req.body;
    for(var key in parsedquery){ //could also be req.query and req.params
        parsedquery[key] !== "" ? query[key] = parsedquery[key] : null;
    }
    console.log(query);
    await trader.getTraderByTags(query).then((resp) => {
        if(resp == null ) {
            return res.status(500).send("server error")
        };
        return res.status(200).send((resp));
    }).catch((error) => {
        console.log(error);
        return res.status(504).send("bad gateway");
    });
});

router.put('/', async(req,res) => {
    try {
        let id = req.query.id;
        let user  = JSON.parse(JSON.stringify(req.body));
        await trader.updateTraderById(id,user).then((resp) => {
            if(resp){
                return res.status(200).send({
                    message: "trader profile updated",
                    value :resp,
                });
            }else if(!resp){
                return res.status(404).send({
                    message: "trader profile not found",
                    value :resp,
                });
            }else {
                return res.status(500).send({
                    message: "Internal Server Error",
                    value :resp,
                });
            }
        });     
    } catch (error) {
        return res.status(504).send("bad gateway");
    }
});

router.delete('/', async(req,res) => {
    try {
        let id = req.query.id;
        await trader.deleteTraderById(id).then((resp) => {
            if(!resp){
                return res.status(404).send({
                    message:"trader not deleted",
                    value :resp,
                });
            }else if (resp == null ){
                return res.status(500).send({
                    message:"server error",
                    value :resp,
                });
            }else {
                return res.status(200).send({
                    message:"trader  deleted",
                    value :resp,
                });
            }
        });
    } catch (error) {
        return res.status(504).send("bad gateway");
    }
});

module.exports =  router;