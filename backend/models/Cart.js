import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId:  { type: Number, required: true },
  title:      { type: String, required: true },
  images:     [{ type: String }],
  size:       { type: String, required: true },
  color:      { type: String, required: true },
  quantity:   { type: Number, required: true, min: 1 },
  price:      { type: Number, required: true },
  discountPrice: { type: Number }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  uid:   { type: String, required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
