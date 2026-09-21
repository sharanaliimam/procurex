const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    quotedAmount: { type: Number, required: true, min: 0 },
    submissionDate: { type: Date, default: Date.now },
    technicalScore: { type: Number, min: 0, max: 100, default: null },
    financialScore: { type: Number, min: 0, max: 100, default: null },
    overallScore: { type: Number, min: 0, max: 100, default: null },
    status: {
      type: String,
      enum: ['Submitted', 'Under Evaluation', 'Approved', 'Rejected'],
      default: 'Submitted'
    }
  },
  { timestamps: true }
);

// Prevent the same vendor from bidding twice on the same tender
bidSchema.index({ tender: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
