const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    businessCategory: {
      type: String,
      enum: ['Goods', 'Works', 'Services', 'Consultancy'],
      default: 'Goods'
    },
    registrationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Blacklisted'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
