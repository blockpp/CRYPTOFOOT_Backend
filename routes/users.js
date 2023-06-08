var express = require('express');
const userUtils = require('../utils/UserUtils');
const userUtilsWeb3 = require('../utils/UserUtilsWeb3');
const jwt = require('jsonwebtoken');
var router = express.Router();
require('dotenv').config();
const user = new userUtils();
const userWeb3 = new userUtilsWeb3();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login',async(req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  await user.validatePassword(username, password).then((resp) => {
    console.log(resp, "login response");
    if(resp == false){
      return res.status(404).send({

        message : "wrong password / or username not found",
        value :resp,
      });
    }else if(resp == null){
      console.log("db error: " + resp);
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
      jwt.sign(payload,'secret' ,{expiresIn:`12h`},(err,token) => {
        if(err){
          console.log("error here bro")
            res.status(403).send({
                message: "login error occured",
                value :resp
            });
        }else {
            res.status(200).send({token: token,data:payload});
        }
      });
      if (resp.role==="trader") {

        
      } else {
        
      }
     
    }
  }).catch((err) => {
    console.log("bad gateway",err);
    return res.status(504).send("bad gateway");
  });
})
router.post('/details',async(req,res) => {
  const id= req.body.id;
  console.log(req.body)
  console.log(req.params)
  
  await userWeb3.getWalletDetails(id).then((resp) => {
    if(resp == false){
      console.log('wrong password');
      return res.status(404).send({

        message : "wron / or  not found",
        value :resp,
      });
    }else if(resp == null){
      console.log("db error: " + resp);
      return res.status(500).send({
        message: "database error",
        value : resp
      });
    }else {
      
      return res.status(200).send(resp);
     
    }})
  // }).catch((err) => {
    // console.log("bad gateway",err);
    // return res.status(504).send("bad gateway");
  // });
})



router.post('/exportpriv',async(req,res) => {
  const id= req.body.id;
  const password= req.body.password;
  
  await userWeb3.exportPrivateKey(id,password).then((resp) => {
    if(resp == false){
      console.log('wrong password');
      return res.status(404).send({

        message : "wron / or  not found",
        value :resp,
      });
    }else if(resp == null){
      console.log("db error: " + resp);
      return res.status(500).send({
        message: "database error",
        value : resp
      });
    }else {
      
      return res.status(200).send(resp);
     
    }
  }).catch((err) => {
    console.log("bad gateway",err);
    return res.status(504).send("bad gateway");
  });
})

router.get('/getByWallet/', async(req , res) => {
  try {
    const wallet = req.query.wallet;
    console.log(wallet , "wallet params");
    await user.getUserByWallet(wallet).then((resp) => {
      console.log(resp , "user by wallet");

      if (!resp) {
        return res.status(404).send(resp);
      }else if (resp === null) {
        return res.status(500).send(resp);
      }else {
        return res.status(200).send(resp);
      }
    })
  } catch (error) {
    return res.status(504).send(error);
  }
})


module.exports = router;
