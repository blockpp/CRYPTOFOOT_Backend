const { Agent } = require('http');
const Trader =require('../models/Trader');

module.exports = class TraderUtils{
    constructor(){}

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
            let traderExist = (await Trader.findOne(user.email))? true: false;
            if(!traderExist){
                return false;
            }else {
                const newTrader = new Trader(user);
                await newTrader.save().then((resp) => {
                    if(!resp){
                        return false;
                    }
                    return false
                });
            }

        } catch (error) {   
            return error;
        }
    }
    
}