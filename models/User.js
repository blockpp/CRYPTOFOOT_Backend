const mongoose = require("mongoose");
var crypto = require("crypto");
const options = {discriminatorKey: 'itemtype'};

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
    pubKey: {
        type: String,
        required: true,
    },
    privKey: {
        type: String,
        required: true
    },
    created_at: {
        type: Data,
        default: Date.now(),
    },

}, options);

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.hash = crypto.pbkdf2Sync(password, this.salt,1000,64,'sha512').toString('base64');
};
UserSchema.method.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password,
        this.salt,1000,64,"sha512").toString('base64');
        console.log(password,hash,this.hash);
        return this.hash === hash;
};

module.exports = User = mongoose.model('user',UserSchema);