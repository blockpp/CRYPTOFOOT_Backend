const { Agent } = require('http');
const Trader =require('../models/Trader');

module.exports = class TraderUtils{
    constructor(){}

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
            const newTrader = new Trader();
            if(!traderExistByEmail  && !traderExistByUsername & !traderExistByPhoneNumber ){
                return false;
            }
                newTrader.username = user.username;
                newTrader.setPassword(user.password) ;
                newTrader.email = user.email;
                newTrader.name = user.name;
                newTrader.address = user.address;
                newTrader.age = user.age;
                newTrader.phoneNumber = user.phoneNumber;
    
                await newTrader.save().catch((error) => {
                    console.log(error);
                    return null;
                });
                return true;
            

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
            return trader;
        }catch(error) {
            return null;
        }
    }
    async updateTraderById(user){
        
    }
    
}