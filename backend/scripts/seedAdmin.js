// run: node scripts/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = "s8947211@gmail.com";
  const plain = "shuv1234"; // change this before seeding on prod

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash(plain, 10);
  await Admin.create({ email, password: hashed });
  console.log("Admin created:", email);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
