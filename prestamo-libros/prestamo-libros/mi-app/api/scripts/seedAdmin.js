const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');

async function seed() {
  await connectDB();
  const email = 'admin@example.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const hashed = await bcrypt.hash('Admin123!', 10);
  const admin = new User({ name: 'Admin', email, password: hashed, role: 'admin' });
  await admin.save();
  console.log('Admin created:', email);
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
