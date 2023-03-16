const express = require('express');
const router = express.Router();
const admin = require('../utils/AdminUtils');
const Admin = new admin();
router.post('/', async (req, res) => {
  
    const parsedTrader= JSON.parse(JSON.stringify(req.body));
    await Admin.addAdmin(parsedTrader).then((response) => {
      console.log(response, "response");
      if(response){
        return res.status(201).send({
          message : "Admin has been created",
          value :response,
        });
      }else if (!response) {
        return res.status(400).send({
          message : "admin does exist change username , email or phone number",
          value :response
        });
      }else {
        return res.status(500).send({
          message :"database error",
          value :response 
        });
      }
    }).
   catch ((err) => {
    console.error(err);
    res.status(502).send(err);
  });
});
router.get('/',async(req,res) => {
  
  await Admin.getAll().then((resp)  => {
    if(!resp) {
      return res.status(404).send({
        message : "no admins found",
        value : resp
      });
    }else if (resp == null) {
      return res.status(500).send({
        message : "Data base error",
      });
    }else {
      return res.status(200).send({
        message : "Admins found",
        value : resp
      });
    }
  }).catch((err) => {
    return res.status(502).send("bad gateway");
  });
});

module.exports = router;
