const Admin = require('../models/Admin');

const adminutils = require('./adminutilsWEB3');


module.exports = class AdminUtils {
  constructor() {}

  async addAdmin(user) {
    try {
      let adminExist = await Admin.findOne({ "email": user.email });
      if (adminExist !== null) {
        return false;
      } else {
        const newAdmin = new Admin();
        newAdmin.email = user.email;
        newAdmin.username = user.username;
        newAdmin.password = user.password;
        newAdmin.name = user.name;
        newAdmin.phoneNumber = user.phoneNumber;
        newAdmin.address = user.address;
        newAdmin.age = user.age;
        newAdmin.pubKey = user.pubKey;
        newAdmin.privKey = user.privkey;
        newAdmin.save();
        const addWeb3 = await adminutils.addUser(user.name, user.email);
        console.log(addWeb3);
        return true;
      }
    } catch (error) {
      console.log(error);
      return null;
    }   
  }

  async getAdmins() {
    try {
      let admins = await Admin.find();
      return admins;
    } catch (error) {
      return error;
    }
  }

  async getAdminById(id) {
    try {
      let admin = await Admin.findById(id);
      return admin;
    } catch (error) {
      return error;
    }
  }

  async updateAdmin(id, updatedData) {
    try {
      let updatedAdmin = await Admin.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      return updatedAdmin;
    } catch (error) {
      return error;
    }
  }

  async deleteAdmin(id) {
    try {
      let deletedAdmin = await Admin.findByIdAndDelete(id);
      return deletedAdmin;
    } catch (error) {
      return error;
    }
  }

  async login(email, password) {
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });

      // If admin not found, return false
      if (!admin) {
        return false;
      }

      // Check if password is correct
      const isMatch = await admin.comparePassword(password);

      // If password is incorrect, return false
      if (!isMatch) {
        return false;
      }

      // Create a JWT token
      const token = jwt.sign({ id: admin._id }, JWT_SECRET);

      return { admin, token };
    } catch (error) {
      return error;
    }
  }

  async authenticate(token) {
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Find admin by ID from the token
      const admin = await Admin.findById(decoded.id);

      // If admin not found, return false
      if (!admin) {
        return false;
      }

      return admin;
    } catch (error) {
      return error;
    }
  }

  async validateCorporate(id) {
    try {
      const Corporate = await Corporate.findById(id);

      if (!Corporate) {
        return false;
      }

      Corporate.status = 'approved';
      await Corporate.save();

      return Corporate;
    } catch (error) {
      return error;
    }
  }


     
  async refuseCorporate(id) {
    try {
      const Corporate = await Corporate.findById(id);

      if (!Corporate) {
        return false;
      }

      Corporate.status = 'rejected';
      await Corporate.save();

      return Corporate;
    } catch (error) {
      return error;
    }
  }

}