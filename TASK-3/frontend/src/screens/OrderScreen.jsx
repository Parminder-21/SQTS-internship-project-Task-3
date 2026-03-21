import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderScreen = ({ match }) => {
  const id = window.location.pathname.split('/').pop();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    if (userInfo) fetchOrder();
  }, [id, userInfo]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: 36, color: '#2874f0' }}></i>
    </div>
  );
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!order) return null;

  return (
    <div className="animate-fade-in">
      {/* Success Banner */}
      <div style={{ background: '#388e3c', color: '#fff', borderRadius: 4, padding: '24px 32px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <i className="fas fa-check-circle" style={{ fontSize: 40 }}></i>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Order Confirmed! 🎉</h2>
          <p style={{ opacity: 0.9, fontSize: 14 }}>Your order has been placed and will be delivered soon.</p>
          <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Order ID: <strong>{order._id}</strong></p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, alignItems: 'start' }}>
        <div>
          {/* Shipping */}
          <div className="card" style={{ marginBottom: 8 }}>
            <h3 style={{ fontWeight: 500, marginBottom: 10 }}>📦 Delivery Address</h3>
            <p style={{ fontSize: 14, color: '#555' }}>
              {order.shippingAddress.address}, {order.shippingAddress.city},<br />
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <p style={{ marginTop: 8, fontSize: 13 }}>
              <span style={{ color: order.isDelivered ? '#388e3c' : '#878787', fontWeight: 500 }}>
                {order.isDelivered ? `✓ Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : '⏳ Not yet delivered'}
              </span>
            </p>
          </div>

          {/* Payment */}
          <div className="card" style={{ marginBottom: 8 }}>
            <h3 style={{ fontWeight: 500, marginBottom: 10 }}>💳 Payment</h3>
            <p style={{ fontSize: 14 }}>Method: <strong>{order.paymentMethod}</strong></p>
            <p style={{ marginTop: 6, fontSize: 13, fontWeight: 500, color: order.isPaid ? '#388e3c' : '#ff6161' }}>
              {order.isPaid ? `✓ Paid on ${new Date(order.paidAt).toLocaleDateString()}` : '✗ Not Paid'}
            </p>
          </div>

          {/* Items */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontWeight: 500 }}>🛍️ Order Items</h3>
            </div>
            {order.orderItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f9f9f9', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'contain', border: '1px solid #eee', borderRadius: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product}`} style={{ color: '#212121', fontSize: 14 }}>{item.name}</Link>
                  <div style={{ fontSize: 13, color: '#878787', marginTop: 2 }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="price-box" style={{ position: 'sticky', top: 80 }}>
          <h3>Price Details</h3>
          <div className="price-row">
            <span>Items Price</span>
            <span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? <span className="price-saving">Free</span> : `₹${order.shippingPrice}`}</span>
          </div>
          <div className="price-row">
            <span>Tax (GST)</span>
            <span>₹{order.taxPrice?.toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row price-total">
            <span>Total Amount</span>
            <span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
          </div>
          <Link to="/" className="btn btn-block btn-blue" style={{ marginTop: 16, borderRadius: 2, justifyContent: 'center', textDecoration: 'none', padding: '13px' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
