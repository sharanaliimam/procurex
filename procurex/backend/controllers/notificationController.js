const Tender = require('../models/Tender');
const Evaluation = require('../models/Evaluation');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = [];
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const dueSoon = await Tender.find({
      submissionDeadline: { $gte: now, $lte: in48h },
      status: 'Published'
    });
    dueSoon.forEach((t) => {
      notifications.push({
        type: 'warning',
        message: `Tender ${t.tenderId} (${t.title}) submission deadline is approaching.`,
        date: t.submissionDeadline
      });
    });

    const overdue = await Tender.find({
      submissionDeadline: { $lt: now },
      status: 'Published'
    });
    overdue.forEach((t) => {
      notifications.push({
        type: 'warning',
        message: `Tender ${t.tenderId} (${t.title}) deadline has passed and is still Published. Move it to evaluation.`,
        date: t.submissionDeadline
      });
    });

    const awarded = await Tender.find({ status: 'Awarded' }).sort({ updatedAt: -1 }).limit(5);
    awarded.forEach((t) => {
      notifications.push({
        type: 'success',
        message: `Tender ${t.tenderId} (${t.title}) has been awarded.`,
        date: t.updatedAt
      });
    });

    const pendingEvals = await Evaluation.find({ status: 'Pending' })
      .populate('tender', 'tenderId title')
      .limit(10);
    pendingEvals.forEach((e) => {
      notifications.push({
        type: 'warning',
        message: `Evaluation pending for Tender ${e.tender?.tenderId} (${e.tender?.title}).`,
        date: e.createdAt
      });
    });

    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
