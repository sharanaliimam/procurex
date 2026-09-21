const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
    docType: {
      type: String,
      enum: ['Tender Notice', 'Terms & Conditions', 'Technical Specification', 'Evaluation Report', 'Other'],
      default: 'Other'
    },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
