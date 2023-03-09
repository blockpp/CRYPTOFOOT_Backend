var express = require('express');
var router = express.Router();
const UserUtils = require('../utils/UserUtils');
const userUtils = new UserUtils();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin',async(req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  const userRole = await userUtils.checkRoleByUsername(username);
  if(userRrole != false && userRole != null){
    const validPasswd = await userUtils.validatePassword(username, password);
  }

})

module.exports = router;
