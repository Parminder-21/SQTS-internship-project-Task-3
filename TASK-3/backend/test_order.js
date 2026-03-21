const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/orderModel');
const User = require('./models/userModel');

const testOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    
    // get any user
    const user = await User.findOne({});
    if (!user) throw new Error("No user found");

    const order = new Order({
        orderItems: [
            {
                name: 'Test Product',
                qty: 1,
                image: '/images/test.jpg',
                price: 100,
                product: new mongoose.Types.ObjectId()
            }
        ],
        user: user._id,
        shippingAddress: {
            address: '123 Main St',
            city: 'Springfield',
            postalCode: '62701',
            country: 'USA',
        },
        paymentMethod: 'UPI / QR Code',
        itemsPrice: 100,
        taxPrice: 15,
        shippingPrice: 10,
        totalPrice: 125,
    });

    const createdOrder = await order.save();
    console.log("Order created successfully!", createdOrder._id);
    await Order.findByIdAndDelete(createdOrder._id);
    process.exit(0);
  } catch (error) {
    console.error("Order save failed:", error.message);
    process.exit(1);
  }
};

testOrder();
