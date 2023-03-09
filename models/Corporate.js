const mongoose = require('mongoose');
const User = require('./User');
const CorporateSchema = new mongoose.Schema({
    FiscalAddress: {
        type: String,
        required: true
    },
    LegalName: {
        type: String,
        required: true
    },
    LegalCreationDate: {
        type: String,
        required: true
    },
    LegalDocuments: {
        type: [String],
        required: true
    }
});


let Corporate = User.discriminator("Corporate", CorporateSchema);
module.exports = Corporate = mongoose.model('Corporate');