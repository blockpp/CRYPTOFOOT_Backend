var express = require('express');
var router = express.Router();
const UserUtils = require('../utils/UserUtils');
const jwt = require("jsonwebtoken");

const userUtils = new UserUtils();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res){
  res.send("Hello admin");
});

router.get('/login',async(req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  await userUtils.validatePassword(username, password).then((resp) => {
    if(resp == false){
      return res.status(404).send({
        message : "wrong password / or username not found",
        value :resp,
      });
    }else if(resp == null){
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
      });
    }
  }).catch((err) => {
    console.log(err);
    return res.status(504).send("bad gateway");
  });
});

module.exports = router;
