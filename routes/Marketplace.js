var express = require('express');
var router = express.Router();
const MarketplaceUtils = require('../utils/MarketplaceWeb3');
const  marketplaceUtils = new MarketplaceUtils();

router.post('/',async(req,res) => {
    try {
        const metadataUri = req.body.params.metadata;
        const price = req.body.params.price;
        const id = req.body.params.id;
        console.log(metadataUri,price,id)
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

});
router.get('/marketitems',async (req, res) => {
    try {
       await marketplaceUtils.fetchMarketItem().then((resp) => {
        if(resp===null){
            return res.status(500).send("internal blockchain error");
        }
        else{
            res.status(200).send(resp);
        }
       })
        
    } catch (error) {
        return res.status(400).send("internal error: " + error.message);
        
    }
})

router.get('/metadata/:id',async (req, res) => {
    try {
        const id = req.params.id;
        await marketplaceUtils.fetchMetadataHash(id).then((resp)=>{
            if (resp===null) {
                return res.status(500).send("internal blockchain error");
                
            } else{
                res.status(200).send(resp);
            }
        })
    } catch (error) {
        return res.status(400).send("internal error: " + error.message);
        
    }
})
router.post('/createmarketsale',async (req, res) => {
    const buyerId = req.body.buyerId;
    const tokenId = req.body.tokenId;
    const price = req.body.price;
    
    try {
        await marketplaceUtils.createMarketSell(tokenId, price,buyerId).then((resp)=>{
            if (resp===null) {
                return res.status(500).send("internal blockchain error");
                
            } else{
                res.status(200).send(resp);
            }
        })
    } catch (error) {
        return res.status(400).send("internal error: " + error.message);
    }
})
module.exports = router;