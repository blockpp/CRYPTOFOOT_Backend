require("dotenv").config();
const {ethers, Wallet} = require("ethers")
module.exports  = class TraderUtilsWeb3{
    constructor(){
        this.privateKey = process.env.PRIVATE_KEY;
        this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
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
}