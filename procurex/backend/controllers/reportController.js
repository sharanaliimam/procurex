const Tender = require('../models/Tender');

exports.getSummary = async (req, res) => {
  try {
    const byStatus = await Tender.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const byCategory = await Tender.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const byMonth = await Tender.aggregate([
      {
        $group: {
          _id: { year: { $year: '$publicationDate' }, month: { $month: '$publicationDate' } },
          totalAmount: { $sum: '$estimatedBudget' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    const total = await Tender.countDocuments();

    res.json({
      total,
      byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
      byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })),
      byMonth: byMonth.map((m) => ({
        label: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        totalAmount: m.totalAmount,
        count: m.count
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
