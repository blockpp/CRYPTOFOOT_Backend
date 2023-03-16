const Admin = require('../models/Admin');
module.exports = class AdminUtils {
    constructor(){}

    async addAdmin(admin){
        try {
            const adminExistByEmail = await Admin.findOne({$or:[{"email": admin.email},  {'username': admin.username} , {'phoneNumber':admin.phoneNumber}]});
           
            if(adminExistByEmail != null ){
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
          
            await newAdmin.save().catch((error) => {
                console.log(error);
                return null
            });
            return true;

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
}