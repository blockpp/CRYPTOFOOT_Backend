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

            const tx = await trader.addTrader(_id,_pubKey,{
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
}