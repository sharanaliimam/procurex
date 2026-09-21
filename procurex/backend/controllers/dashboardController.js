const Tender = require('../models/Tender');
const Vendor = require('../models/Vendor');
const Evaluation = require('../models/Evaluation');

exports.getDashboard = async (req, res) => {
  try {
    const [totalTenders, activeTenders, completedTenders, registeredVendors, pendingEvaluations, budgetAgg, statusAgg, recentTenders] =
      await Promise.all([
        Tender.countDocuments(),
        Tender.countDocuments({ status: { $in: ['Published', 'Under Evaluation'] } }),
        Tender.countDocuments({ status: { $in: ['Awarded', 'Closed'] } }),
        Vendor.countDocuments(),
        Evaluation.countDocuments({ status: 'Pending' }),
        Tender.aggregate([{ $group: { _id: null, total: { $sum: '$estimatedBudget' } } }]),
        Tender.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Tender.find().sort({ createdAt: -1 }).limit(5)
      ]);

    const upcomingDeadlines = await Tender.find({
      submissionDeadline: { $gte: new Date() },
      status: { $in: ['Published', 'Under Evaluation'] }
    }).sort({ submissionDeadline: 1 }).limit(5);

    res.json({
      totalTenders,
      activeTenders,
      completedTenders,
      registeredVendors,
      pendingEvaluations,
      totalProcurementValue: budgetAgg[0]?.total || 0,
      tendersByStatus: statusAgg.map((s) => ({ status: s._id, count: s.count })),
      recentTenders,
      upcomingDeadlines
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
