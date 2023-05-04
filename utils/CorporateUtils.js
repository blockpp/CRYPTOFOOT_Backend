const Corporate = require('../models/Corporate');
const CorporateUtilsWeb3 = require('./CorporateUtilsWeb3');
const corporateUtilsWeb3 = new CorporateUtilsWeb3();    
module.exports = class CorporateUtils{
    constructor(){}

    async addCorporate(corporate){
        try {
            const corporateExistByemail = await Corporate.findOne({$or:[{"email": corporate.email},  {'username': corporate.username} , {'legalName':corporate.legalName} , {'fiscalAddress' : corporate.fiscalAddress }]});
            console.log(corporateExistByemail ,"corporate by email");
            const wallet = await corporateUtilsWeb3.addWallet();
            if(corporateExistByemail !== null || wallet == null){
                return false;
            }
            const newCorporate = new Corporate();
            newCorporate.username = corporate.username;
            newCorporate.email = corporate.email;
            newCorporate.fiscalAddress = corporate.fiscalAddress;
            newCorporate.legalName = corporate.legalName;

            newCorporate.setPassword(corporate.password);
            newCorporate.pubKey = wallet.address;
            newCorporate.setWallet(wallet.privateKey);

            await newCorporate.save().catch((err) => {
                console.log(err);
                return null
            });
            const result = await corporateUtilsWeb3.addCorporate(newCorporate._id, wallet.address);
            return result;

        } catch (error) {
            console.log(error);
            return null;   
        }
    }
    async getCorporateByTags(_options){
    
        try {
            
            let corporate = await Corporate.find(_options);
            console.log(corporate, "dynamique search");   
            return corporate; 
        } catch (error) {
            console.log(error ,"error");
            return null;
        }
    }
    async getCorporateByUsername(_username){
        try {
            let corporateExist = await Corporate.findOne({'username': _username});
            if(corporateExist=== null ){
                return false;
            }
            return corporateExist;
        } catch (error) {
            return null;
        }
    }
    async getAllCorporate(){
        try {
            let corporates = await Corporate.find();
            if(corporates === null ){
                return false;
            }
            return corporates;
        } catch (error) {
            return null;
        }
    }
    async getCorporateById(_id){
        try{
            let corporate = await Corporate.findById(_id);
            if(corporate === null ){
                return false;
            }
            return corporate;

        }catch(error){
            return null;
        }
    }
    async getCorporateByEmail(_email){
        try{
            let corporate = await Corporate.findOne({'email': _email});
            if(corporate == null ){
                return false;
            }
            return true;
        }catch(error) {
            return null;
        }
    }
}