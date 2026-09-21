require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Tender = require('./models/Tender');
const Vendor = require('./models/Vendor');
const Bid = require('./models/Bid');
const Evaluation = require('./models/Evaluation');

const run = async () => {
  await connectDB();

  await Promise.all([
    Tender.deleteMany({}),
    Vendor.deleteMany({}),
    Bid.deleteMany({}),
    Evaluation.deleteMany({})
  ]);

  const tenders = await Tender.insertMany([
    {
      tenderId: 'TND-101',
      title: 'Supply of Office Computers',
      description: 'Procurement of 50 desktop computers for HQ.',
      category: 'Goods',
      estimatedBudget: 2500000,
      publicationDate: new Date('2026-06-01'),
      submissionDeadline: new Date('2026-06-20'),
      status: 'Published'
    },
    {
      tenderId: 'TND-102',
      title: 'Road Maintenance Project - Zone 4',
      description: 'Repair and resurfacing of 5km road stretch.',
      category: 'Works',
      estimatedBudget: 15000000,
      publicationDate: new Date('2026-07-05'),
      submissionDeadline: new Date('2026-09-05'),
      status: 'Published'
    },
    {
      tenderId: 'TND-103',
      title: 'IT Consultancy for ERP Rollout',
      description: 'Consultancy services for ERP implementation.',
      category: 'Consultancy',
      estimatedBudget: 4000000,
      publicationDate: new Date('2026-05-10'),
      submissionDeadline: new Date('2026-05-30'),
      status: 'Under Evaluation'
    },
    {
      tenderId: 'TND-098',
      title: 'Cleaning Services Contract',
      description: 'Annual office cleaning services.',
      category: 'Services',
      estimatedBudget: 900000,
      publicationDate: new Date('2026-03-01'),
      submissionDeadline: new Date('2026-03-15'),
      status: 'Awarded'
    },
    {
      tenderId: 'TND-090',
      title: 'Stationery Supply Contract',
      description: 'Yearly office stationery supply.',
      category: 'Goods',
      estimatedBudget: 350000,
      publicationDate: new Date('2026-01-10'),
      submissionDeadline: new Date('2026-01-25'),
      status: 'Closed'
    }
  ]);

  const vendors = await Vendor.insertMany([
    {
      vendorName: 'Rahim Uddin',
      company: 'TechSource Ltd.',
      email: 'contact@techsource.com',
      phone: '01711000001',
      businessCategory: 'Goods',
      status: 'Active'
    },
    {
      vendorName: 'Farida Yasmin',
      company: 'BuildWell Constructions',
      email: 'info@buildwell.com',
      phone: '01711000002',
      businessCategory: 'Works',
      status: 'Active'
    },
    {
      vendorName: 'Shakil Ahmed',
      company: 'Skyline Consultants',
      email: 'hello@skylineconsult.com',
      phone: '01711000003',
      businessCategory: 'Consultancy',
      status: 'Active'
    },
    {
      vendorName: 'Nusrat Jahan',
      company: 'CleanPro Services',
      email: 'sales@cleanpro.com',
      phone: '01711000004',
      businessCategory: 'Services',
      status: 'Active'
    }
  ]);

  const bid1 = await Bid.create({
    tender: tenders[2]._id,
    vendor: vendors[2]._id,
    quotedAmount: 3800000,
    status: 'Under Evaluation'
  });

  const bid2 = await Bid.create({
    tender: tenders[0]._id,
    vendor: vendors[0]._id,
    quotedAmount: 2400000,
    status: 'Submitted'
  });

  const evaluation = new Evaluation({
    bid: bid1._id,
    tender: tenders[2]._id,
    vendor: vendors[2]._id,
    technicalScore: 85,
    financialScore: 90,
    status: 'Pending'
  });
  await evaluation.save();

  console.log('Seed data inserted successfully.');
  console.log(`Tenders: ${tenders.length}, Vendors: ${vendors.length}, Bids: 2, Evaluations: 1`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
