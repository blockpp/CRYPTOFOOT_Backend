const User = require('../models/User');
const {ethers, Wallet} = require("ethers");
module.exports = class UserUtilsWeb3 {
    constructor (){
        this.privateKey = process.env.PRIVATE_KEY;
        this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI);
    }
    async  getWalletDetails (_id){
        
        try {
            const myUser = await User.findOne({_id:_id});
            console.log("gotcha ?",myUser)
            if (myUser) {
                let privKey =  myUser.getWallet();
                await this.provider.getNetwork();
                
                const wallet  = new Wallet(privKey,this.provider).connect(this.provider);
                const bigBalance = await wallet.getBalance();
                const ethBalance = ethers.BigNumber.from(bigBalance).toString()


                let details = {
                    address:wallet.address,
                    balance:ethBalance,
                }
                
                return details;
            }else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return null

        }
    }
    async exportPrivateKey(_id , _password){
            const myUser = await User.findOne({_id:_id});
            console.log("got user",myUser);
           
            if(myUser === null){
                return false; 
            }
            const result = await myUser.validPassword(_password);
            if(result){
                let privKey =  myUser.getWallet();
                return privKey;
            }else {
                return result;
            }
        }
}