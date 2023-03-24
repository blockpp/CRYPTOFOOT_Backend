var express = require('express');
const Trader = require('../models/Trader');
var router = express.Router();
const TraderUtils = require('../utils/TraderUtils');
const trader = new TraderUtils();
const jwt = require("jsonwebtoken");
const authenticateTrader = require('../middleware/Authenticate');
router.post('/resetPassword',async(req,res) => {
    try {
        const id = req.body.id;
        const password = req.body.password;
        const newPassword= req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        const validPassword = await  trader.validatePasswordById(id,password);
        if(validPassword && (newPassword == confirmPassword)){
        await trader.resetPassword(id,password,newPassword).then((resp) => {
            console.log(resp);
            if(resp == false){
                return res.status(404).send({
                    message: "Trader not found",
                });
            }
            else if(resp == null){
                return res.status(500).send({
                    message : "internal database error",
                    value : resp
                });
            }
            else {
                return res.status(200).send({
                    message: "password has been updated",
                    value :resp,
                });
            }
        });
    }else {
        return res.status(401).send({
            message: "unothorized bad password ",
        });
    }
    } catch (error) {
        return res.status(502).send("bad gateway");
    }
})
router.post('/login',async(req,res) =>  {
    const username = req.body.username;
    const password = req.body.password;
    trader.validatePassword(username, password).then((resp) => {
        if(!resp){
            return res.status(404).send({
                    message : "wrong password / or username not found",
                    value :resp,
            }   
            );
        }else if(resp === null){
            return res.status(500).send({
                message: "database error",
                value : resp
            });
        }else {
            const payload = {
                "email" : resp.email,
                "username": username,
                "role": resp.role,
                "id" : resp._id,
                "pubKey" : resp.pubKey,
            }
            jwt.sign(payload,"secret",{expiresIn:`12h`},(err,token) => {
                if(err){
                    res.status(403).send({
                        message: "login error occured",
                        value :resp
                    });
                }else {
                    res.status(200).send({token: token});
                }
            })
        }
    }).catch((err) => {
        return res.status(504).send("bad gateway");
    })
})
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

router.get('/id', authenticateTrader,async(req, res) => {
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

router.get('/email', async(req,res) => {
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
router.get('/web3',async(req,res) =>  {
    const id  = req.query.id.toString();
    await trader.getTraderWeb3ById(id).then((resp) => {
        if(resp == null ){
            return res.status(500).send({
                message : "server error",
                value: resp,
            });
        }else if (resp == false){
            return res.status(404).send({
                message : "trader not found",
                value :resp,
            });
        }else {
            return res.status(200).send({
                message: "trader found",
                value : resp,
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(504).send("bad gateway");
    });
});
router.get('/wallet',async(req,res) => {
    const id = req.query.id;
    await trader.getWalletById(id).then((resp) => {
        if(resp ==false ){
            return res.status(404).send({
                message: "trader not found",
                value :resp
            });
        }else if(resp == null){
            return res.status(500).send({
                message : "server error",
                value :resp
            });
        }else {
            return res.status(200).send({
                message: "trader wallet found",
                value : resp
            });
        }
    }).catch((err) => {
        return res.status(504).send("bad gateway");
    })
})
module.exports =  router;