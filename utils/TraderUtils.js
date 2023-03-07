const { Agent } = require('http');
const Trader =require('../models/Trader');

module.exports = class TraderUtils{
    constructor(){}

    async addTrader(user){
        try {
            let traderExist = await Trader.findOne({"email" : user.email});
            if(traderExist != null){
                return false;
            }
                const newTrader = new Trader();
                newTrader.username = user.username;
                newTrader.password = user.password;
                newTrader.email = user.email;
                newTrader.name = user.name;
                newTrader.address = user.address;
                newTrader.age = user.age;
                newTrader.phoneNumber = user.phoneNumber;
    
                newTrader.save().catch((error) => {
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
    
}