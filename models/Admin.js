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
    googleId: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: "admin"
    }
});

const getAllTraders = async () => {
  try {
    const traders = await User.find({ userType: 'trader' });
    return traders;
  } catch (error) {
    console.error(error);
  }
};

const getAllCorporates = async () => {
  try {
    const corporates = await User.find({ userType: 'corporate' });
    return corporates;
  } catch (error) {
    console.error(error);
  }
};

var Admin = User.discriminator("admin", AdminSchema);
module.exports = Admin = mongoose.model('admin');

module.exports = { Admin, getAllTraders, getAllCorporates };
