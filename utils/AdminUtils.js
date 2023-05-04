const Admin = require('../models/Admin');
const AdminutilsWEB3 = require('./adminutilsWEB3')
const adminutilsWEB3 = new AdminutilsWEB3();
module.exports = class AdminUtils {
    constructor(){}

    
    async addAdmin(admin){
        try {
            const adminExistByEmail = await Admin.findOne({$or:[{"email": admin.email},  {'username': admin.username} , {'phoneNumber':admin.phoneNumber}]});
            const wallet =await adminutilsWEB3.addWallet();

            if(adminExistByEmail != null || wallet == null){
                return false;
            }
            const newAdmin = new Admin()
            newAdmin.username = admin.username;
            newAdmin.setPassword(admin.password) ;
            newAdmin.email = admin.email;
            newAdmin.name = admin.name;
            newAdmin.address = admin.address;
            newAdmin.age = admin.age;
            newAdmin.phoneNumber = admin.phoneNumber;
            newAdmin.setWallet(wallet.privateKey);
            newAdmin.pubKey = wallet.address;
          
            await newAdmin.save().catch((error) => {
                console.log(error);
                return null
            });

            const result = adminutilsWEB3.addAdmin(newAdmin._id,wallet.address);
            return result;

        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async getAll(){
        try {
            let adminExist = await Admin.find();
            if(adminExist.length == 0 ){
                return false;
            }else {
                return adminExist;
            }
        } catch (error) {   
            return null;
        }
    }
    async getAdminById(_id){
        try {
            let adminExist = await Admin.findById(_id);
            if(adminExist == null ){
                return false;
            }else {
                return adminExist;
            }
        } catch (error) {
            return null
        }
    }
    async validatePasswordById(_id, _password){
        try {
            const adminExist = await Admin.findById(_id);
            if(adminExist === null){
                return false; 
            }
            const result = await Admin.validPassword(_password);
            if(result){
                return Admin;
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
            const adminExist = await Admin.findOne({"username": _username});
            if(adminExist === null){
                return false; 
            }
            const result = await adminExist.validPassword(_password);
            if(result){
                return adminExist;
            }else {
                return result;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async getAdminByTags(_options){
    
        try {
            
            let adminExist = await Admin.find(_options);
            console.log(adminExist, "dynamique search");   
            return adminExist; 
        } catch (error) {
            console.log(error ,"error");
            return null;
        }
    }
    async getAdminByEmail(_email){
        try{
            let adminExist = await Admin.findOne({'email': _email});
            if(adminExist == null){
                return false;
            }
            return adminExist;
        }catch(error){
            return null
        }
    }
    async getAdminByPhoneNumber(_phoneNumber){
        try {
            console.log(_phoneNumber,"phone number");
            let adminExist = await Admin.findOne({'phoneNumber': _phoneNumber});
            console.log(adminExist);
            if(adminExist== null ){
                return false;
            }
            return adminExist;
        }catch (error) {
            return false;
        }
    }
    async getAdminByUsername(_username){
        try {
            let adminExist = await Admin.findOne({'username': _username});
            if(adminExist=== null ){
                return false;
            }
            return adminExist;
        } catch (error) {
            return null;
        }
    }
    async deleteAdminById(_id){
        try {

            let adminExist = await this.getAdminById(_id);
            console.log(adminExist);
            if(adminExist){
            let admin = await Admin.deleteOne(adminExist).catch((err) => {
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
             const admin = await this.getAdminById(_id);
             console.log(admin ,"admin ss");
             if(admin != null){
                     admin.setPassword(_newPassword);
                     await admin.save();
                     return true;
             }else {
                 return false;
             }   
        } catch (error) {
             console.log(error);
             return null;
        }
    }
}