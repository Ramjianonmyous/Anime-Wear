import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  items: [{
    id:       { type: Number, required: true },
    title:    { type: String, required: true },
    size:     { type: String, required: true },
    color:    { type: String, required: true },
    quantity: { type: Number, required: true },
    price:    { type: Number, required: true },
    image:    { type: String }
  }],
  paymentId:     { type: String },
  paymentMethod: { type: String, default: 'Razorpay' },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'IN TRANSIT',
    enum: ['ORDER PLACED', 'SHIPPED', 'IN TRANSIT', 'DELIVERED', 'CANCELLED']
  },
  trackingNumber: {
    type: String
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
