const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema(
  {
    tenderId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['Goods', 'Works', 'Services', 'Consultancy'],
      default: 'Goods'
    },
    estimatedBudget: { type: Number, required: true, min: 0 },
    publicationDate: { type: Date, required: true },
    submissionDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Under Evaluation', 'Awarded', 'Closed'],
      default: 'Draft'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tender', tenderSchema);
