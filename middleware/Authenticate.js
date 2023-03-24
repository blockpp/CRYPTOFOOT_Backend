const jwt = require('jsonwebtoken');
require('dotenv').config();
const cr_key = process.env.CRYPT_KEY.toString();
function authenticateTrader(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401) 
    
    jwt.verify(token, "secret" , (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);    
    req.user = user;
    console.log(req.ueser);
    next();
    });
}

export default {authenticateTrader}