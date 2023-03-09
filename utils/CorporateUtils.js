const Corporate = require('../models/Corporate');
const jwt = require('jsonwebtoken');

module.exports = class CorporateUtils {
  constructor() {}

  async addCorporate(corporate) {
    try {
      let corporateExist = await Corporate.findOne({ email: corporate.email });
      if (corporateExist) {
        return { message: 'This corporate already exists' };
      } else {
        const newCorporate = new Corporate(corporate);
        await newCorporate.save();

        // Generate a JWT token for the newly added corporate
        const token = jwt.sign({ corporateId: newCorporate._id }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });

        return {
          corporate: newCorporate,
          token: token
        };
      }
    } catch (error) {
      return error;
    }
  }
  

  async getCorporates() {
    try {
      return await Corporate.find();
    } catch (error) {
      return error;
    }
  }

  async getCorporateById(id) {
    try {
      return await Corporate.findById(id);
    } catch (error) {
      return error;
    }
  }

  async updateCorporate(id, updatedCorporate) {
    try {
      return await Corporate.findByIdAndUpdate(id, updatedCorporate, { new: true });
    } catch (error) {
      return error;
    }
  }

  async deleteCorporate(id) {
    try {
      return await Corporate.findByIdAndDelete(id);
    } catch (error) {
      return error;
    }
  }
}