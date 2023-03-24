const express = require('express');
const router = express.Router();
const admin = require('../utils/AdminUtils');
const Admin = new admin();
const jwt = require("jsonwebtoken");

router.post('/resetPassword',async(req,res) => {
  try {
      const id = req.body.id;
      const password = req.body.password;
      const newPassword= req.body.newPassword;
      const confirmPassword = req.body.confirmPassword;
      const validPassword = await  trader.validatePasswordById(id,password);
      if(validPassword && (newPassword == confirmPassword)){
      await Admin.resetPassword(id,password,newPassword).then((resp) => {
          console.log(resp);
          if(resp == false){
              return res.status(404).send({
                  message: "Admin not found",
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
router.post('/login' , async(req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  Admin.validatePassword(username, password).then((resp) => {
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
    console.log(err);
    return res.status(504).send("bad gateway");
});
});
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
router.get('/id',async(req,res) => {
  let id = req.query.id;
  await Admin.getAdminById(id).then((resp) => {
    if(!resp){
      return res.status(404).send({
        message : "no admins found",
        value : resp, 
      });
    }
    else if (resp == null){
      return res.status(500).send({
        message : "database error",
        value :resp
      });
    }else {
      return res.status(200).send({
        message : "admins found", 
        value : resp
      });
    }
  }).catch((err) => {
    return res.status(502).send("bad gateway");
  })
});
router.get('/email',async(req,res) => {
  let email = req.query.email;
  await Admin.getAdminByEmail(email).then((resp) => {
    if(!resp){
      return res.status(404).send({
        message : "no admins found",
        value : resp, 
      });
    }
    else if (resp == null){
      return res.status(500).send({
        message : "database error",
        value :resp
      });
    }else {
      return res.status(200).send({
        message : "admins found", 
        value : resp
      });
    }
  }).catch((err) => {
    return res.status(502).send("bad gateway");
  })
});
router.get('/phoneNumber',async(req,res) => {
  let phoneNumber = req.query.phoneNumber.toString();
  await Admin.getAdminByPhoneNumber(phoneNumber).then((resp) => {
    if(!resp){
      return res.status(404).send({
        message : "no admins found",
        value : resp, 
      });
    }
    else if (resp == null){
      return res.status(500).send({
        message : "database error",
        value :resp
      });
    }else {
      return res.status(200).send({
        message : "admins found", 
        value : resp
      });
    }
  }).catch((err) => {
    return res.status(502).send("bad gateway");
  })
});
router.get('/username',async(req,res) => {
  let username = req.query.username;
  await Admin.getAdminByUsername(username).then((resp) => {
    if(!resp){
      return res.status(404).send({
        message : "no admins found",
        value : resp, 
      });
    }
    else if (resp == null){
      return res.status(500).send({
        message : "database error",
        value :resp
      });
    }else {
      return res.status(200).send({
        message : "admins found", 
        value : resp
      });
    }
  }).catch((err) => {
    return res.status(502).send("bad gateway");
  })
});
router.delete('/',async(req,res) => {
  let id = req.query.id;
  await Admin.deleteAdminById(id).then((resp) => {
    if(!resp){
      return res.status(404).send({
          message:"admin not deleted",
          value :resp,
      });
  }else if (resp == null ){
      return res.status(500).send({
          message:"server error",
          value :resp,
      });
  }else {
      return res.status(200).send({
          message:"admin  deleted",
          value :resp,
      });
  }
  }).catch((err) => {
    return res.status(502).send("bad gateway");
  })
});

module.exports = router;
