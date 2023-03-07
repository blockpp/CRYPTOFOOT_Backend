const mongoose = require('mongoose');
const User = require('./User');

const CorporateSchema = new mongoose.Schema({
  fiscalAddress: {
    type: String,
    required: true
  },
  legalName: {
    type: String,
    required: true
  },
  legalCreationDate: {
    type: String,
    required: true
  },
  legalDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
});

const Corporate = User.discriminator('corporate', CorporateSchema);
module.exports = Corporate;