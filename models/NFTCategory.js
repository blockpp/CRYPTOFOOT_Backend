const mongoose = require('mongoose');

const NFTCategory = new mongoose.Schema({
    Name :{
        type: String, 
        required: true,
    },
    utilites  : [{
        type: String,
    }],
    
})