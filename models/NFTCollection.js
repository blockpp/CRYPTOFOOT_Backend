const mongoose = require('mongoose');

const NFTCollectionSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique : true,
    },
    Description : {
        type: String,
    },
    Owner : {
        type: String,
        required: true,
    },
    Creator: {
        type: String,
        required: true,
    },
    Categories : [{
        type: mongoose.Types.ObjectId,
    }],

})
module.exports = NFTCollectionSchema = mongoose.model("NFTCollection");