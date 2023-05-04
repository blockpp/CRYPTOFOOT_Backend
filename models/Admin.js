const mongoose = require('mongoose');
var aes256 = require('aes256');
const User = require('./User');
const AdminSchema = new mongoose.Schema({
    cin: {
        type: Buffer,
    },
    name: {
        type: String ,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    }
});

var Admin = User.discriminator("admin", AdminSchema);
module.exports = Admin = mongoose.model('admin');