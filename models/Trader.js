const mongoose = require('mongoose');
var aes256 = require('aes256');
const User = require('./User');
const TraderSchema = new mongoose.Schema({
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
    googleId: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    }
});

var Trader = User.discriminator("trader", TraderSchema);
module.exports = Trader = mongoose.model('trader');