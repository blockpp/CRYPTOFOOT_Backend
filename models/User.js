const mongoose = require("mongoose");
var crypto = require("crypto");
const aes256 = require("aes256");
require('dotenv').config();

const options = {discriminatorKey: 'role'};

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    bio : {
        type: String,
    },
    pubKey: {
        type: String,
    },
    privKey: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    image: {
        type: Buffer,
    },
    validated: {
        type: Boolean,
        default: false,
    },
    salt:{
        type: String,
        required: true
    }

}, options);

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString(`hex`);
    this.password = crypto.pbkdf2Sync(password, this.salt,1000,64,`sha512`).toString(`hex`);
};
UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password,
    this.salt,1000,64,`sha512`).toString(`hex`);
    console.log(password,hash,this.password);
    return this.password === hash;
};
UserSchema.methods.setWallet = function(wallet){
    var encryptedPrivKey = aes256.encrypt(process.env.CRYPT_KEY,wallet);
    this.privKey = encryptedPrivKey;
};
UserSchema.methods.getWallet = function(){
    return aes256.decrypt(process.env.CRYPT_KEY, this.privKey);
}
module.exports = User = mongoose.model('user',UserSchema);