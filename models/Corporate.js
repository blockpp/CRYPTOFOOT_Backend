const mongoose = require('mongoose');
const User = require('./User');
const CorporateSchema = new mongoose.Schema({
    fiscalAddress : {
        type: String,
        required: true
    },
    legalName : {
        type: String,
        required: true,
    },
    legalDocumets : [{
        type: String,
    }]
});

let Corporate = User.discriminator('corporate', CorporateSchema);
module.exports = Corporate = mongoose.model('corporate');
