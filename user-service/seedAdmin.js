// Example using Mongoose (MongoDB)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './user.js';

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Check if admin already exists so we don't duplicate
  const existingAdmin = await User.findOne({ username: 'Prayash' });
  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const adminUser = new User({
    username: 'Prayash',
    password: '123123',
    role: 'admin' // <--- This allows them to pass your middleware
  });

  await adminUser.save();
  console.log('Admin created successfully!');
  mongoose.connection.close();
};
export default seedAdmin;