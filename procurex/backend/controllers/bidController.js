const Bid = require('../models/Bid');

exports.getAll = async (req, res) => {
  try {
    const { tender, vendor, status } = req.query;
    const filter = {};
    if (tender) filter.tender = tender;
    if (vendor) filter.vendor = vendor;
    if (status) filter.status = status;
    const bids = await Bid.find(filter)
      .populate('tender', 'tenderId title status')
      .populate('vendor', 'vendorName company')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('tender', 'tenderId title status')
      .populate('vendor', 'vendorName company');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const bid = new Bid(req.body);
    await bid.save();
    const populated = await bid.populate([
      { path: 'tender', select: 'tenderId title status' },
      { path: 'vendor', select: 'vendorName company' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This vendor has already submitted a bid for this tender.' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate([
      { path: 'tender', select: 'tenderId title status' },
      { path: 'vendor', select: 'vendorName company' }
    ]);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json(bid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json({ message: 'Bid deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
