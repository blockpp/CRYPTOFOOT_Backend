require("dotenv").config();
const {ethers, Wallet} = require("ethers");
const traderJson = require("../abi/contracts/Admin.sol/Admin.json");
module.exports  = class adminutilsWEB3{
    constructor(){
        this.privateKey = process.env.PRIVATE_KEY;
        this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
        this.ContractAddress = process.env.ADMIN_ADDRESS;
    }
    async addWallet(){
        try {
            await this.provider.getNetwork();
            const wallet = new Wallet.createRandom().connect(this.provider);
            console.log(wallet.address, "address");
            console.log(wallet.privateKey,"private key");
            console.log(wallet.mnemonic, "mnemonic");
            return wallet;
            
        } catch (error) {
            return null
        }
    }
    async addAdmin(_id,_pubKey){
        try {
            console.log(_id);
            await this.provider.getNetwork();
            const wallet = new Wallet(this.privateKey,this.provider).connect(this.provider);
            const trader = new ethers.Contract(this.ContractAddress,traderJson, wallet);
            const gasPrice = await this.provider.getFeeData();
            const tx = await trader.addAdmin(_id,_pubKey,{
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
    async getAdmin(_privateKey) {
        try {
            const tr = {
                "id": "",
                "created_at" : ""
            };
            await this.provider.getNetwork();
            const wallet = new Wallet(_privateKey,this.provider).connect(this.provider);
            const trader = new ethers.Contract(this.ContractAddress,traderJson, wallet);
            const tx = await trader.getAdmin(wallet.address);
            console.log(tx)
            tr.id = tx.id.toString();
            tr.created_at = ethers.BigNumber.from(tx.created_at).toString();
            return tr;
        } catch (error) {
            console.log(error);

            return null;
        }
    }

}