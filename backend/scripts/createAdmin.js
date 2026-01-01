#!/usr/bin/env node
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const usage = () => {
  console.log('Usage: node scripts/createAdmin.js <name> <email> <password>');
  process.exit(1);
};

const [,, name, email, password] = process.argv;
if (!name || !email || !password) usage();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User with email ${email} already exists (role: ${existing.role}).`);
      process.exit(0);
    }

    // Create user; the User model hashes the password in pre-save hook
    const user = new User({ name, email, password, role: 'admin' });
    await user.save();
    console.log(`Admin user created: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

run();
