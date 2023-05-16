const {ethers, Wallet} = require("ethers");
const MarketplaceJson = require('../abi/contracts/Marketplace.sol/Marketplace.json');
const CorporateUtils = require('./CorporateUtils');
const TraderUtils = require("./TraderUtils");
const corporate = new CorporateUtils();
const trader= new TraderUtils();
require("dotenv").config();

module.exports = class MarketplaceWeb3 {
    constructor (){
        this.privateKey = process.env.PRIVATE_KEY;
        this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
        this.ContractAddress = process.env.MARKETPLACE_ADDRESS;
    }
    async createToken(tokenURI , _price,id){
        try {
            const crp = await corporate.getCorporateById(id);
            console.log("got corporate",crp);
            if (crp) {
                let privKey =  crp.getWallet();
                await this.provider.getNetwork();
                const price = _price.toString()
                
                const wallet  = new Wallet(privKey,this.provider).connect(this.provider);
                console.log("the wallet m using is ",wallet.address);
                const marketplace = new ethers.Contract(this.ContractAddress,MarketplaceJson , wallet);
                const gasPrice = await this.provider.getFeeData();
                console.log("the price is",price);
                const tx = await marketplace.createToken(tokenURI , _price , {
                    value: ethers.utils.parseEther(price),
                    gasPrice : gasPrice.gasPrice.toHexString(),
                    // gasLimit : ethers.BigNumber.from(300000).toHexString()
                });
                await tx.wait();
                console.log( tx ,"tx content");
                return true;
            }else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return null

        }
    }
    async reSellToken(tokenId, price , id) {
        try {
            const crp = await corporate.getCorporateById(id);
            let privKey = crp.getWallet();
            console.log(privKey,"privKey");
           if (crp != false && crp!= null) {
             await this.provider.getNetwork();
             const parsedPrice = ethers.utils.parseEther(price);
             const wallet = new Wallet(this.privateKey , this.provider).connect(this.provider);
             console.log(wallet);
             const marketplace = new ethers.Contract(this.ContractAddress , MarketplaceJson ,wallet);
             const gasPrice = await this.provider.getFeeData();
             const tx = await marketplace.reSellToken(tokenId , parsedPrice, {
                 value: parsedPrice,
                 gasPrice : gasPrice.gasPrice.toHexString(),
                 gasLimit : ethers.BigNumber.from(300000).toHexString()
             });
             await tx.wait(); 
             console.log(tx.toHexString , "tx content reselltoken");
             return true;
           }else {
            return false;
           }
        } catch (error) {
            console.log(error, "error");
            return null;
        }
    }
    async createMarketSell(tokenId, price ,id){
        try {   
            console.log("my price",price);
            const tra = await trader.getTraderById(id);
            const privateKey = tra.getWallet();
            
            if (tra) {
                await this.provider.getNetwork();
                let priceStr = price.toString();
                const parsedPrice = ethers.utils.parseEther(priceStr);
                const wallet = new Wallet(privateKey , this.provider).connect(this.provider);
                const marketplace = new ethers.Contract(this.ContractAddress , MarketplaceJson ,wallet);
                const gasPrice = await this.provider.getFeeData();
                const tx = await marketplace.createMarketSell(tokenId.toString() , {
                    value: parsedPrice,
                    gasPrice : gasPrice.gasPrice.toHexString(),
                    gasLimit : ethers.BigNumber.from(300000).toHexString()
                });
                await tx.wait; 
                console.log(tx , "tx content reselltoken");
                return true;
            }else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    async fetchMarketItem() {
        try {
            
            await this.provider.getNetwork();
            const wallet = new Wallet(this.privateKey , this.provider).connect(this.provider);
            const marketplace = new ethers.Contract(this.ContractAddress, MarketplaceJson , wallet);
          
            const tx = await marketplace.fetchMarketItem();
            return tx;
            
        } catch (error) {
            return null;
        }
    }
    async fetchMyNFT(id){
        try {

            await this.provider.getNetwork();
            const wallet = new Wallet(privKey , this.provider).connect(this.provider);
            const marketplace = new ethers.Contract(this.ContractAddress, MarketplaceJson , wallet);
            const tx = await marketplace.fetchMyNFT();
            return tx;
        } catch (error) {
            return null
        }
    }
    async fetchItemsListed(id){
        try {
            const crp = await corporate.getCorporateById(id);
            let privKey =  crp.getWallet();
            if(crp){
            await this.provider.getNetwork();
            const wallet = new Wallet(privKey , this.provider).connect(this.provider);
            const marketplace = new ethers.Contract(this.ContractAddress, MarketplaceJson , wallet);
            const tx = await marketplace.fetchItemsListed();
            return tx;
        }else return false;
        } catch (error) {
            return null
        }
    }
    async fetchMetadataHash(id){
        try {
            await this.provider.getNetwork();
            const wallet = new Wallet(this.privateKey , this.provider).connect(this.provider);
            const marketplace = new ethers.Contract(this.ContractAddress, MarketplaceJson , wallet);
            const tx = await marketplace.tokenURI(id)
            return tx;
            
        } catch (error) {
            return null;
        }
    }

}