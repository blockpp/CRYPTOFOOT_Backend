require("dotenv").config();
const {ethers, Wallet} = require("ethers");
const corporateJson = require("../abi/contracts/Corporate.sol/Corporate.json");
module.exports  = class CorporateutilsWEB3{

    constructor(){
        
        this.privateKey = process.env.PRIVATE_KEY;
        this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
        this.ContractAddress = process.env.CORPORATE_ADDRESS;
    }
    async addWallet(){
        
        try {
            
            await this.provider.getNetwork();
            const wallet = new Wallet.createRandom().connect(this.provider);
            const Wallet1 = new Wallet(this.privateKey , this.provider).connect(this.provider);
            let amountInEther = '10';
            let tx = {
                to : wallet.address,
                value: ethers.utils.parseEther(amountInEther , 'ether')
            };
            const tx1 = await Wallet1.sendTransaction(tx);
            tx1.wait();
            console.log(wallet.address, "address");
            
            console.log(wallet.privateKey,"private key");
            console.log(wallet.mnemonic, "mnemonic");
            return wallet;
            
        } catch (error) {
            return null
        }
    }
    async addCorporate(_id, _pubkey){
        try {
            console.log(_id);
            await this.provider.getNetwork();
            const wallet = new Wallet(this.privateKey,this.provider).connect(this.provider);
            const corporate = new ethers.Contract(this.ContractAddress,corporateJson, wallet);
            const gasPrice = await this.provider.getFeeData();
            const tx = await corporate.addCorporate(_id,_pubkey,{
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