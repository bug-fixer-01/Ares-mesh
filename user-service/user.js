// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    // 1. Enum restricts the values to ONLY these strings
    enum: ['user', 'admin'],
    // 2. Default ensures if no role is provided, they become a 'user'
    default: 'user' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// })

//compare Passwords
userSchema.methods.comparePasswords = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User",userSchema);
export default User;