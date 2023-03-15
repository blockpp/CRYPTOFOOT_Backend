require("dotenv").config();
const {ethers, Wallet} = require("ethers");
const traderJson = require("../abi/contracts/Trader.sol/Trader.json");
module.exports  = class TraderUtilsWeb3{
    constructor(){
        this.privateKey = process.env.PRIVATE_KEY;
        this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
        this.ContractAddress = process.env.TRADER_ADDRESS;
    }
    async addWallet(){
        try {
            await this.provider.getNetwork();
            const wallet = new Wallet.createRandom().connect(this.provider);
            return wallet;
            
        } catch (error) {
            return null
        }
    }
    async addTrader(_id,_pubKey){
        try {
            await this.provider.getNetwork();
            const wallet = new Wallet(this.privateKey,this.provider).connect(this.provider);
            const trader = new ethers.Contract(this.ContractAddress,traderJson, wallet);
            const gasPrice = await this.provider.getFeeData();
            const idBytes = ethers.utils.formatBytes32String(_id)
            const tx = await trader.addTrader(idBytes,_pubKey,{
                gasPrice : gasPrice.gasPrice.toHexString(),
                gasLimit : ethers.BigNumber.from(300000).toHexString()
            });
            await tx.wait();
            console.log(tx,"hash");
            return true;
        } catch (error) {
            console.log(error);
            return null;
        }   
    }
    async getTrader(_privateKey) {
        try {
            const tr = {
                "id": "",
                "created_at" : ""
            };
            await this.provider.getNetwork();
            const wallet = new Wallet(_privateKey,this.provider).connect(this.provider);
            const trader = new ethers.Contract(this.ContractAddress,traderJson, wallet);
            console.log(wallet.address);
            const tx = await trader.getTrader(wallet.address);
            console.log(tx)
            tr.id = tx.id;
            
            tr.created_at = ethers.BigNumber.from(tx.created_at).toString();
            return tr;
        } catch (error) {
            console.log(error);

            return null;
        }
    }
}