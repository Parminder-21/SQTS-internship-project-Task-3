const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Product = require('./models/productModel');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: 'password', isAdmin: true },
      { name: 'John Doe', email: 'john@example.com', password: 'password' },
    ]);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = [
      // ─── Electronics ──────────────────────────────────────────────────
      { name: 'Apple AirPods Wireless Bluetooth Headphones', image: '/images/airpods.jpg', description: 'Bluetooth technology lets you connect wirelessly. High-quality audio with built-in microphone. Up to 24 hours battery life.', brand: 'Apple', category: 'Electronics', price: 14900, countInStock: 10, rating: 4.5, numReviews: 12 },
      { name: 'Amazon Echo Dot 3rd Gen Smart Speaker', image: '/images/alexa.jpg', description: 'Compact smart speaker with Alexa built in. Controls smart home devices with your voice. Plays music, radio, audiobooks.', brand: 'Amazon', category: 'Electronics', price: 4499, countInStock: 12, rating: 4.9, numReviews: 120 },
      { name: 'Canon EOS 80D DSLR Camera', image: '/images/camera.jpg', description: 'Versatile imaging with dual focusing systems and 45-point cross-type AF. 24.2 Megapixel CMOS sensor.', brand: 'Canon', category: 'Electronics', price: 74990, countInStock: 5, rating: 4.7, numReviews: 89 },
      { name: 'Logitech G502 Gaming Mouse', image: '/images/mouse.jpg', description: '6 programmable buttons, LIGHTSYNC RGB, Hero 25K sensor for ultra-precise tracking.', brand: 'Logitech', category: 'Electronics', price: 3500, countInStock: 25, rating: 4.6, numReviews: 45 },
      { name: 'boAt Rockerz 450 Bluetooth Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', description: 'On-ear wireless headphones with 15 hours playback and superior sound signature.', brand: 'boAt', category: 'Electronics', price: 1299, countInStock: 30, rating: 4.2, numReviews: 240 },
      { name: 'JBL Flip 6 Portable Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', description: 'Waterproof, 12-hour battery, bold JBL Original Pro Sound. Richer bass, stronger mid-range.', brand: 'JBL', category: 'Electronics', price: 9999, countInStock: 15, rating: 4.5, numReviews: 92 },

      // ─── Mobiles ───────────────────────────────────────────────────────
      { name: 'iPhone 13 Pro 256GB', image: '/images/phone.jpg', description: 'Transformative triple-camera system, ProMotion display, and unprecedented battery life. A15 Bionic chip.', brand: 'Apple', category: 'Mobiles', price: 119900, countInStock: 7, rating: 4.8, numReviews: 24 },
      { name: 'Samsung Galaxy S23 Ultra 256GB', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop', description: '200MP camera, built-in S Pen, Snapdragon 8 Gen 2 processor, 5000mAh battery.', brand: 'Samsung', category: 'Mobiles', price: 124999, countInStock: 8, rating: 4.7, numReviews: 56 },
      { name: 'OnePlus 11 5G 128GB', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', description: 'Hasselblad camera, 100W SUPERVOOC charging, 6.7" AMOLED display.', brand: 'OnePlus', category: 'Mobiles', price: 56999, countInStock: 15, rating: 4.6, numReviews: 102 },
      { name: 'Redmi Note 12 Pro 5G', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop', description: '200MP camera, 67W turbo charging, Snapdragon 732G, 5000mAh battery.', brand: 'Xiaomi', category: 'Mobiles', price: 22999, countInStock: 20, rating: 4.4, numReviews: 315 },

      // ─── Fashion ──────────────────────────────────────────────────────
      { name: "Men's Slim Fit Casual Shirt", image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', description: 'Premium cotton slim-fit shirt. Available in multiple colors. Perfect for casual outings and meetings.', brand: 'Peter England', category: 'Fashion', price: 999, countInStock: 50, rating: 4.1, numReviews: 76 },
      { name: "Women's Floral Kurti Ethnic Wear", image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop', description: 'Beautiful floral printed kurti made from breathable rayon. Perfect festive and daily wear.', brand: 'W', category: 'Fashion', price: 699, countInStock: 40, rating: 4.3, numReviews: 134 },
      { name: 'Nike Air Max 270 Running Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', description: 'Lightweight, breathable mesh upper with Max Air unit in the heel for all-day cushioning.', brand: 'Nike', category: 'Fashion', price: 10995, countInStock: 20, rating: 4.6, numReviews: 58 },
      { name: "Levi's 511 Slim Fit Jeans", image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', description: 'Classic slim-fit jeans made from stretch denim for comfort. 5-pocket styling.', brand: "Levi's", category: 'Fashion', price: 2999, countInStock: 35, rating: 4.4, numReviews: 92 },
      { name: "Ray-Ban Aviator Classic Sunglasses", image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', description: 'Iconic Aviator frame with crystal lenses. UV protection. Lightweight metal frame.', brand: 'Ray-Ban', category: 'Fashion', price: 7490, countInStock: 18, rating: 4.7, numReviews: 167 },

      // ─── Appliances ────────────────────────────────────────────────────
      { name: 'LG 5 Star Inverter Split AC 1.5 Ton', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', description: '5-star energy efficiency, dual inverter compressor, Wi-Fi enabled, copper condenser.', brand: 'LG', category: 'Appliances', price: 44990, countInStock: 6, rating: 4.5, numReviews: 67 },
      { name: 'Philips Air Fryer HD9257 1.2kg', image: 'https://images.unsplash.com/photo-1648815789547-44c3b5c3bbbc?w=400&h=400&fit=crop', description: 'Rapid Air Technology for crispier food with 90% less fat. Easy clean basket.', brand: 'Philips', category: 'Appliances', price: 7995, countInStock: 14, rating: 4.5, numReviews: 218 },
      { name: 'Samsung 8kg Front Load Washing Machine', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop', description: 'EcoBubble technology, Steam wash, hygiene programme, 1400 RPM spin speed.', brand: 'Samsung', category: 'Appliances', price: 39990, countInStock: 4, rating: 4.4, numReviews: 49 },
      { name: 'Prestige Induction Cooktop 2000W', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', description: 'Auto-shut off, push-button control panel, 7 power settings, suitable for all cookware.', brand: 'Prestige', category: 'Appliances', price: 2295, countInStock: 22, rating: 4.2, numReviews: 142 },

      // ─── Gaming ────────────────────────────────────────────────────────
      { name: 'Sony PlayStation 5 DualSense Controller', image: '/images/playstation.jpg', description: 'Haptic feedback, adaptive triggers, built-in microphone, USB-C charging.', brand: 'Sony', category: 'Gaming', price: 5990, countInStock: 15, rating: 4.9, numReviews: 36 },
      { name: 'Xbox Wireless Controller – Carbon Black', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', description: 'Textured grip, USB-C charging, compatible with Xbox, PC, and mobile platforms.', brand: 'Microsoft', category: 'Gaming', price: 5490, countInStock: 10, rating: 4.7, numReviews: 28 },
      { name: 'Razer BlackShark V2 Gaming Headset', image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop', description: '70 hr battery, THX Spatial Audio, HyperClear Supercardioid Mic, ultra-soft memory foam.', brand: 'Razer', category: 'Gaming', price: 15999, countInStock: 8, rating: 4.6, numReviews: 41 },

      // ─── Grocery ──────────────────────────────────────────────────────
      { name: 'Tata Salt Iodised 1kg Pack', image: 'https://images.unsplash.com/photo-1584990347449-a2d4c2b7ab0a?w=400&h=400&fit=crop', description: 'Vacuum evaporated iodized salt from Tata. Free-flowing, hygienic and rich in iodine.', brand: 'Tata', category: 'Grocery', price: 28, countInStock: 100, rating: 4.6, numReviews: 560 },
      { name: 'Amul Butter 500g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop', description: 'Pasteurised cream butter. Rich taste for spreads, cooking, and baking. Made from fresh cream.', brand: 'Amul', category: 'Grocery', price: 265, countInStock: 50, rating: 4.8, numReviews: 820 },
      { name: 'Aashirvaad Atta Whole Wheat 5kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop', description: 'Made from 100% whole wheat grains. Rich in fiber and nutrients. Ideal for soft rotis.', brand: 'Aashirvaad', category: 'Grocery', price: 275, countInStock: 80, rating: 4.5, numReviews: 430 },

      // ─── Furniture ─────────────────────────────────────────────────────
      { name: 'Sleepyhead Ortho Memory Foam Mattress Queen', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop', description: 'Pressure-relieving memory foam, orthopedic design, CertiPUR-US certified, 10-year warranty.', brand: 'Sleepyhead', category: 'Furniture', price: 11999, countInStock: 5, rating: 4.5, numReviews: 97 },
      { name: 'Nilkamal Engineered Wood Study Desk', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop', description: 'Durable engineered wood desk with cable management and spacious work surface.', brand: 'Nilkamal', category: 'Furniture', price: 8499, countInStock: 7, rating: 4.2, numReviews: 53 },
    ].map(p => ({ ...p, user: adminUser }));

    await Product.insertMany(sampleProducts);
    console.log(`✅ Data Imported! Total products: ${sampleProducts.length}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
