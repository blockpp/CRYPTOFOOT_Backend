const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
    
    Name: {
        type: String,
        required : true
    },
    Description : {
        type : String,
        required : true,
    },
    address: {
        type: String,
        required : true,
    },
    tokenId : {
        type : String,
        required : true,
    },
    CurrentOwner : {
        type :  String,
    },
    FloorPrice: {
        type : Number,
    },
    CurrentPrice: {
        type: Number,
    },
    Collection : {
        type:  mongoose.Types.ObjectId,
        ref: "NFTCollection",
    },
    URIMetadata: {
        type : String,
        required : true,
    },
    Category : {
        type: mongoose.Types.ObjectId,
        ref: "NFTCategory",
        required : true,
    },

});
module.exports = NFT = mongoose.model('NFT',NFTSchema);