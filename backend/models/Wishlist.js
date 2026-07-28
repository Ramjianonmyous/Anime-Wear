import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  uid:        { type: String, required: true, unique: true },
  productIds: [{ type: Number }]
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);
