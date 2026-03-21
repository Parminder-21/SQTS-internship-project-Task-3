import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const PlaceOrderScreen = () => {
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [loading, setLoading] = useState(false);

  const shippingAddress = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 499 ? 0 : 40;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  const savings = cartItems.reduce((acc, item) => acc + (Math.round(item.price * 1.2) - item.price) * item.qty, 0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) navigate('/cart');
    else if (!shippingAddress.address) navigate('/checkout');
  }, [cartItems, navigate, shippingAddress]);

  const placeOrderHandler = async () => {
    if (!userInfo) {
      showToast('Please login to place an order', 'error');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems.map(item => ({
          name: item.name, qty: item.qty, image: item.image,
          price: item.price, product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }, config);
      clearCart();
      localStorage.removeItem('shippingAddress');
      showToast('Order placed successfully! 🎉', 'success');
      navigate(`/order/${data._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { value: 'UPI / QR Code', label: 'UPI / QR Code', icon: 'fas fa-qrcode' },
    { value: 'Credit Card', label: 'Credit / Debit Card', icon: 'fas fa-credit-card' },
    { value: 'PayPal', label: 'PayPal', icon: 'fab fa-paypal' },
    { value: 'Cash on Delivery', label: 'Cash on Delivery', icon: 'fas fa-money-bill-wave' },
  ];

  return (
    <div>
      {/* Steps */}
      <div className="steps">
        <span className="step">🛒 Cart</span>
        <span className="step-divider">›</span>
        <span className="step">📦 Address</span>
        <span className="step-divider">›</span>
        <span className="step active">💳 Order Summary</span>
        <span className="step-divider">›</span>
        <span className="step">✅ Payment</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, alignItems: 'start' }}>
        {/* Left */}
        <div>
          {/* Delivery Address */}
          <div className="card" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 4, fontSize: 15 }}>📦 Delivery Address</h3>
                <p style={{ fontSize: 13, color: '#555' }}>
                  {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
              <Link to="/checkout" style={{ fontSize: 13, color: '#2874f0', fontWeight: 500 }}>Change</Link>
            </div>
          </div>

          {/* Order Items */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontWeight: 500, fontSize: 15 }}>🛍️ Order Items</h3>
            </div>
            {cartItems.map((item, i) => {
              const mrp = Math.round(item.price * 1.2);
              return (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f9f9f9', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'contain', border: '1px solid #eee', padding: 4, borderRadius: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item._id}`} style={{ color: '#212121', fontSize: 14 }}>{item.name}</Link>
                    <div style={{ fontSize: 13, color: '#878787', marginTop: 2 }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600 }}>₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through' }}>₹{(item.qty * mrp).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Method */}
          <div className="card">
            <h3 style={{ fontWeight: 500, fontSize: 15, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>💳 Payment Method</h3>
            {paymentOptions.map(opt => (
              <div key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(opt.value)}>
                <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} />
                <i className={opt.icon} style={{ fontSize: 18, color: '#2874f0', width: 22 }}></i>
                <label>{opt.label}</label>
              </div>
            ))}

            {paymentMethod === 'UPI / QR Code' && (
              <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #f0f0f0', marginTop: 12 }}>
                <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Scan & Pay ₹{totalPrice.toFixed(2)}</p>
                <p style={{ fontSize: 12, color: '#878787', marginBottom: 12 }}>UPI ID: parmindar135-1@oksbi</p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=parmindar135-1@oksbi%26pn=E-Shop%20Pro%26am=${totalPrice.toFixed(2)}%26cu=INR`}
                  alt="UPI QR Code"
                  style={{ width: 180, height: 180, border: '3px solid #2874f0', borderRadius: 8, padding: 6 }}
                />
                <p style={{ fontSize: 12, color: '#878787', marginTop: 8 }}>Pay using any UPI app (GPay, PhonePe, Paytm)</p>
              </div>
            )}
          </div>
        </div>

        {/* Right - Price Details */}
        <div className="price-box" style={{ position: 'sticky', top: 80 }}>
          <h3>Price Details</h3>
          <div className="price-row">
            <span>Price ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
            <span>₹{(itemsPrice + savings).toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row">
            <span>Discount</span>
            <span className="price-saving">− ₹{savings.toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row">
            <span>Delivery Charges</span>
            <span>{shippingPrice === 0 ? <span className="price-saving">Free</span> : `₹${shippingPrice}`}</span>
          </div>
          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{taxPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row price-total">
            <span>Total Amount</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          {savings > 0 && (
            <p className="price-saving" style={{ marginTop: 10, fontSize: 13 }}>
              You will save ₹{savings.toLocaleString('en-IN')} on this order
            </p>
          )}
          <button className="btn btn-orange btn-block" onClick={placeOrderHandler} disabled={loading}
            style={{ marginTop: 16, background: '#fb641b', borderRadius: 2, padding: '13px', fontSize: 15 }}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Placing...</> : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
