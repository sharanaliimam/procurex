const Evaluation = require('../models/Evaluation');
const Bid = require('../models/Bid');

exports.getAll = async (req, res) => {
  try {
    const { tender, status } = req.query;
    const filter = {};
    if (tender) filter.tender = tender;
    if (status) filter.status = status;
    const evaluations = await Evaluation.find(filter)
      .populate('tender', 'tenderId title')
      .populate('vendor', 'vendorName company')
      .populate('bid', 'quotedAmount submissionDate')
      .sort({ overallScore: -1 });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('tender', 'tenderId title')
      .populate('vendor', 'vendorName company')
      .populate('bid', 'quotedAmount submissionDate');
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const evaluation = new Evaluation(req.body);
    await evaluation.save();

    await Bid.findByIdAndUpdate(evaluation.bid, {
      technicalScore: evaluation.technicalScore,
      financialScore: evaluation.financialScore,
      overallScore: evaluation.overallScore,
      status: 'Under Evaluation'
    });

    const populated = await evaluation.populate([
      { path: 'tender', select: 'tenderId title' },
      { path: 'vendor', select: 'vendorName company' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This bid has already been evaluated.' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });

    Object.assign(evaluation, req.body);
    await evaluation.save();

    await Bid.findByIdAndUpdate(evaluation.bid, {
      technicalScore: evaluation.technicalScore,
      financialScore: evaluation.financialScore,
      overallScore: evaluation.overallScore,
      status: evaluation.status === 'Approved' ? 'Approved' : evaluation.status === 'Rejected' ? 'Rejected' : 'Under Evaluation'
    });

    const populated = await evaluation.populate([
      { path: 'tender', select: 'tenderId title' },
      { path: 'vendor', select: 'vendorName company' }
    ]);
    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByIdAndDelete(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ message: 'Evaluation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
