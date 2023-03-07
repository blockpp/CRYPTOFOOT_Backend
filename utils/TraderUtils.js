const Trader =require('../models/Trader');
module.exports = class TraderUtils{
    constructor(){}

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