const jwt = require("jsonwebtoken");
require('dotenv').config();
async function authenticateTrader(req, res, next) {
        try {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        
        if (token == null) return res.sendStatus(401)
        
        jwt.verify(token, 'secret', (err , user) => {
            console.log(err)
        
            if (err) return res.sendStatus(403)
            if(user.role == 'trader'){
                req.user = user
                console.log(req.user.role,"user");
            
                next()
            }else {
                return res.sendStatus(403);
            }
        });
        } catch (error) {
            console.log(error);
            return res.json({message: error});  
        }
};
async function authenticateAdmin(req, res, next) {
    try {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, 'secret', (err , user) => {
        console.log(err)
    
        if (err) return res.sendStatus(403)
        if(user.role == 'admin'){
            req.user = user
            console.log(req.user.role,"user");
        
            next()
        }else {
            return res.sendStatus(403);
        }
    });
    } catch (error) {
        console.log(error);
        return res.json({message: error});  
    }
};
async function authenticateCorporate(req, res, next) {
    try {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, 'secret', (err , user) => {
        console.log(err)
    
        if (err) return res.sendStatus(403)
        if(user.role == 'corporate'){
            req.user = user
            console.log(req.user.role,"user");
        
            next()
        }else {
            return res.sendStatus(403);
        }
    });
    } catch (error) {
        console.log(error);
        return res.json({message: error});  
    }
};
module.exports = {
    authenticateTrader,
    authenticateAdmin,
    authenticateCorporate

};