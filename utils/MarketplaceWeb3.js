require("dotenv").config();
const {ethers, Wallet} = require("ethers");
const MarketplaceJson = require('../abi/contracts/Marketplace.sol/Marketplace.json');

module.exports = class MarketplaceWeb3 {
    constructor (){
        this.privateKey = process.env.PRIVATE_KEY;
        this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
        this.ContractAddress = process.env.MARKETPLACE_ADDRESS;
    }
    async createToken(tokenURI , price,privKey){
        try {
            await this.provider.getNetwork();
            const parsedPrice = ethers.utils.parseEther(price);
            const wallet  = new Wallet(privKey,this.provider).connect(this.provider);
            const marketplace = new ethers.Contract(this.ContractAddress,MarketplaceJson , wallet);
            const gasPrice = await this.provider.getFeeData();
            const tx = await marketplace.createToken(tokenURI , parsedPrice , {
                value: parsedPrice,
                gasPrice : gasPrice.gasPrice.toHexString(),
                gasLimit : ethers.BigNumber.from(300000).toHexString()
            });
            await tx.wait();
            console.log( tx.toHexString() ,"tx content");
            return true;
        } catch (error) {
            console.log(error);
            return null
        }
    }
    async reSellToken(tokenId, price , privKey) {
        try {
            await this.provider.getNetwork();
            const parsedPrice = ethers.utils.parseEther(price);
            const wallet = new Wallet(privKey , this.provider).connect(this.provider);
            const marketplace = new ethers.Contract(this.ContractAddress , MarketplaceJson ,wallet);
            const gasPrice = await this.provider.getFeeData();
            const tx = await marketplace.reSellToken(tokenId , parsedPrice, {
                value: parsedPrice,
                gasPrice : gasPrice.gasPrice.toHexString(),
                gasLimit : ethers.BigNumber.from(300000).toHexString()
            });
            await tx.wait; 
            console.log(tx.toHexString , "tx content reselltoken");
            return true;
        } catch (error) {
            return null;
        }
    }
    async createMarketSell(tokenId, price ,privKey){
        try {
            await this.provider.getNetwork();
            const parsedPrice = ethers.utils.parseEther(price);
            const wallet = new Wallet(privKey , this.provider).connect(this.provider);
            const marketplace = new ethers.Contract(this.ContractAddress , MarketplaceJson ,wallet);
            const gasPrice = await this.provider.getFeeData();
            const tx = await marketplace.createMarketSell(tokenId , {
                value: parsedPrice,
                gasPrice : gasPrice.gasPrice.toHexString(),
                gasLimit : ethers.BigNumber.from(300000).toHexString()
            });
            await tx.wait; 
            console.log(tx.toHexString , "tx content reselltoken");
            return true;
        } catch (error) {
            return null;
        }
    }
}