var express = require('express');
var router = express.Router();
const CorporateUtils = require('../utils/CorporateUtils');
const corporate = new CorporateUtils();

router.post('/',async(req,res) => {
        const parsedCorporate = JSON.parse(JSON.stringify(req.body.userData));
        await corporate.addCorporate(parsedCorporate).then((resp) => {
            console.log(resp,"corpoared parsed");
            if(resp == true){
                return res.status(201).send({
                    message: "Corporate created",
                    value: resp
                });
            }else if (resp == false){
                return res.status(400).send({
                    message:"Corporate does exist",
                    value: resp
                });
            }else {
                return res.status(500).send({
                    message:"server error",
                    value: resp
                });
            }
        })
    .catch ((error) =>{
        console.log(error, "502 bad gateway error");
        return res.status(502).send("bad gateway");
    });
});

module.exports =  router;