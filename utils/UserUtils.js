const User = require('../models/User');
module.exports = class UserUtils {
    constructor(){}
    async checkRoleById(_id){
        try {
            const userRole =await  User.findById(_id);
            if(userRole == null ){
                return false;
            }
            return userRole.role;
        } catch (error) {
            return null;
        }
    }
    async checkRoleByUsername(_username){
        try {
            const userRole =await  User.findOne({'username': _username});
            if(userRole == null ){
                return false;
            }
            return userRole.role;
        } catch (error) {
            return null;
        }
    }
    async checkRoleByEmail(_email){
        try {
            const userRole =await  User.findOne({'email': _email});
            if(userRole == null ){
                return false;
            }
            return userRole.role;
        } catch (error) {
            return null;
        }
    }
    async validatePassword(_username, _password){
       
        try {
            const userExist = await User.findOne({'username': _username});
            
            const result = userExist.validPassword(_password);
            if(result){
                return userExist;
            }else {
                return false;
            }
        } catch (error) {
            console.log("error catched here ",error);
            return null;
            
        }
    }
    async getUserByUserName(_username , _password) {
        try{
            const userExist = await User.findOne({'username' : _username});
            if(userExist == null ){
                return false;
            }else {
                return userExist;
            }
        }
        catch(error){
            return null;
        }
    }
}