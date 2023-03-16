const Trader =require('../models/Trader');
const TraderUtilsWeb3 = require('./TraderUtilsWeb3');
const traderUtilsWeb3 = new TraderUtilsWeb3();
module.exports = class TraderUtils{
    constructor(){
        
    }

    async validatePasswordById(_id, _password){
        try {
            const trader = await Trader.findById(_id);
            if(trader === null){
                return false; 
            }
            const result = await trader.validPassword(_password);
            if(result){
                return trader;
            }else {
                return result;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async validatePassword(_username , _password){
        try {
            const trader = await Trader.findOne({"username": _username});
            if(trader === null){
                return false; 
            }
            const result = await trader.validPassword(_password);
            if(result){
                return trader;
            }else {
                return result;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async getTraderByTags(_options){
    
        try {
            
            let trader = await Trader.find(_options);
            console.log(trader, "dynamique search");   
            return trader; 
        } catch (error) {
            console.log(error ,"error");
            return null;
        }
    }
    async getTraderById(_id){
        try{
            let trader = await Trader.findById(_id);
            if(trader === null ){
                return false;
            }
            return trader;

        }catch(error){
            return null;
        }
    }
    async getTraderByEmail(_email){
        try{
            let traderExist = await Trader.findOne({'email': _email});
            if(traderExist == null){
                return false;
            }
            return traderExist;
        }catch(error){
            return null
        }
    }
    async getTraderByPhoneNumber(_phoneNumber){
        try {
            let traderExist = await Trader.findOne({'phoneNumber': _phoneNumber});
            if(traderExist=== null ){
                return false;
            }
            return traderExist;
        }catch (error) {
            return false;
        }
    }
    async getTraderByUsername(_username){
        try {
            let traderExist = await Trader.findOne({'username': _username});
            if(traderExist=== null ){
                return false;
            }
            return traderExist;
        } catch (error) {
            return null;
        }
    }
    async addTrader(user){
        try {

            let traderExistByUsername = await this.getTraderByUsername(user.username);
            let traderExistByPhoneNumber = await this.getTraderByPhoneNumber(user.phoneNumber);
            let traderExistByEmail = await this.getTraderByEmail(user.email);
            console.log(traderExistByEmail,"email");
            console.log(traderExistByUsername, "username");
            console.log(traderExistByPhoneNumber,"phone number");
            let wallet =await traderUtilsWeb3.addWallet();
            console.log(wallet.privateKey);
            const newTrader = new Trader();
            if(!traderExistByEmail  && traderExistByUsername & traderExistByPhoneNumber && wallet == null){
                return false;
            }
                newTrader.username = user.username;
                newTrader.setPassword(user.password) ;
                newTrader.email = user.email;
                newTrader.name = user.name;
                newTrader.address = user.address;
                newTrader.age = user.age;
                newTrader.phoneNumber = user.phoneNumber;
                newTrader.pubKey = wallet.address;
                newTrader.setWallet(wallet.privateKey);
                await newTrader.save().catch((error) => {
                    console.log(error);
                    return null;
                });
                const web3result = await traderUtilsWeb3.addTrader(newTrader._id,newTrader.pubKey);
                
                return web3result;
            

        } catch (error) {  
            console.log(error,"error1");
            return null;
        }
    }
    async getAllTrader(){
        try {
            let traders = await Trader.find();
            if(traders === null ){
                return false;
            }
            return traders;
        } catch (error) {
            return null;
        }
    }

    async getTraderById(_id){
        try{
            let trader = await Trader.findById(_id);
            if(trader === null ){
                return false;
            }
            return trader;

        }catch(error){
            return null;
        }
    }
    async getTraderByEmail(_email){
        try{
            let trader = await Trader.findOne({'email': _email});
            if(trader == null ){
                return false;
            }
            return true;
        }catch(error) {
            return null;
        }
    }
    async updateTraderById(_id,user){
        try {
            let traderEmail =await  this.getTraderByEmail(user.email);
            let traderUsername = await this.getTraderByUsername(user.username);
            let traderPhoneNumber = await this.getTraderByPhoneNumber(user.phoneNumber);
            console.log(traderUsername, "traderUsername gg");
            console.log(traderPhoneNumber,"traderPhoneNumber bb");
            console.log(traderEmail, "traderEmail");
            if(!traderEmail && !traderUsername && !traderPhoneNumber){
               let traderUpdate= await Trader.updateOne({"_id": _id}, {$set: {
                "username": user.username,
                "email": user.email,
                "address": user.address,
                "phoneNumber": user.phoneNumber,
               }}).catch((err) => {
                console.log(err);
                return null;
               });
               console.log(traderUpdate);
               if(traderUpdate.acknowledged){
                    return true;
               }else {
                return false;
               }
            }
        } catch (error) {
            return null ;
        }    
    }
    async deleteTraderById(_id){
        try {

            let traderExist = await this.getTraderById(_id);
            console.log(traderExist);
            if(traderExist){
            let trader = await Trader.deleteOne(traderExist).catch((err) => {
                console.log(err);
                return null;
            });
            return true;
            }else {
                return false;
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async resetPassword(_id , _password,_newPassword){
        try {
             const trader = await this.getTraderById(_id);
             console.log(trader ,"trader ss");
             if(trader != null){
                     trader.setPassword(_newPassword);
                     await trader.save();
                     return true;
             }else {
                 return false;
             }   
        } catch (error) {
             console.log(error);
             return null;
        }
    }
    async getTraderWeb3ById(_id){
        try {
            let trader = await Trader.findById(_id);
            if(trader == null){
                return false;
            }else {
                const privateKey = trader.getWallet().toString();
                console.log(privateKey);
                let traderWeb3 = await traderUtilsWeb3.getTrader(privateKey);
                return traderWeb3;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async getWalletById(_id){
        try {
            const trader = await Trader.findById(_id);
            if(trader == null ){
                return false;
            }else {
                const privKey = trader.getWallet();
                const wallet = await traderUtilsWeb3.getWallet(privKey);
                return wallet;
            }
        } catch (error) {
            return null;
        }
    }
}