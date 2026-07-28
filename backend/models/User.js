import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: {
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    state: { type: String },
    country: { type: String }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
