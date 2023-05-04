var express = require('express');
var router = express.Router();
const MarketplaceUtils = require('../utils/MarketplaceWeb3');
const  marketplaceUtils = new MarketplaceUtils();

router.post('/',async(req,res) => {
    try {
        const metadataUri = req.body.metadata;
        const price = req.body.price;
        const id = req.body.id;
        await marketplaceUtils.createToken(metadataUri , price , id).then((resp) =>  {
            if(resp) {
                return res.status(201).send({
                    message: "NFT has been created",
                    value : resp,
                });
            }else if (resp == false) {
                return res.status(404).send({
                    message:"corporate not found",
                    value : resp,
                });
            }else {
                return res.status(500).send("internal blockchain error");
            }
        });
    } catch (error) {
        return res.status(502).send("bad gateway");
    }
});
router.patch('/' ,async(req, res) => {
    try {
        const tokenId  = req.body.tokenId;
        const price = req.body.price;
        const id = req.body.id;
        await marketplaceUtils.reSellToken(tokenId, price,id).then((resp) => {
            if(resp) {
                return res.status(202).send({
                    message : "token has been set to sell",
                    value : resp,
                });
            } else if (resp == false) {
                return res.status(404).send({
                    message:"corporate not found",
                    value : resp,
                });
            }else {
                return res.status(500).send("internal blockchain error");
            }
        })
    } catch (error) {
        return res.status(502).send("bad gateway");

    }
});
router.get('/mynft/:id',async(req, res) => {
    try {
        const id =req.params.id;
        await marketplaceUtils.fetchItemsListed(id).then((resp) => {
            if(!resp){
                return res.status(404).send({
                    message:"corporate not found",
                    value : resp,
                });
            }else if (resp == null) {
                return res.status(500).send("internal blockchain error");

            }else {
                return res.status(200).send(resp);
            }
        })
    } catch (error) {
        
    }

})
module.exports = router;