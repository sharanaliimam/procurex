const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

exports.getAll = async (req, res) => {
  try {
    const { tender } = req.query;
    const filter = {};
    if (tender) filter.tender = tender;
    const documents = await Document.find(filter).populate('tender', 'tenderId title').sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const doc = new Document({
      tender: req.body.tender,
      docType: req.body.docType || 'Other',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.download = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    const filePath = path.join(__dirname, '..', 'uploads', doc.fileName);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File missing on server' });
    res.download(filePath, doc.originalName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    const filePath = path.join(__dirname, '..', 'uploads', doc.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
