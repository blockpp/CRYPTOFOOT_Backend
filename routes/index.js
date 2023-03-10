var express = require('express');
var router = express.Router();
const UserUtils = require('../utils/UserUtils');
const userUtils = new UserUtils();

const keycloak = require('../config/keycloak-config.js').initKeycloak();
keycloak.getKeycloak;
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', keycloak.protect('admin'), function(req, res){
  res.send("Hello admin");
});
router.get('/signin',async(req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  const userRole = await userUtils.checkRoleByUsername(username);
  if(userRrole != false && userRole != null){
    userUtils.validatePassword(username, password).then((resp) => {
      if(!resp){
        return res.status(400).send({
          message: "bad password",
          value :resp
        });
      }else if (resp == null ){
        return res.status(500).send({
          message: "internal server error",
          value : resp,
        });
      }else {
        
      }
    })
  }

})

module.exports = router;
