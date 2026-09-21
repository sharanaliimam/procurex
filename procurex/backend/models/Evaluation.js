const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true, unique: true },
    tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    technicalScore: { type: Number, required: true, min: 0, max: 100 },
    financialScore: { type: Number, required: true, min: 0, max: 100 },
    overallScore: { type: Number, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    remarks: { type: String }
  },
  { timestamps: true }
);

// Overall Score = Technical x 60% + Financial x 40%
evaluationSchema.pre('save', function () {
  this.overallScore = Number((this.technicalScore * 0.6 + this.financialScore * 0.4).toFixed(2));
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
