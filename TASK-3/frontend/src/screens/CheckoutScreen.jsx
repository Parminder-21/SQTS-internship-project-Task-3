import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutScreen = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const saved = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};

  const [address, setAddress] = useState(saved.address || '');
  const [city, setCity] = useState(saved.city || '');
  const [postalCode, setPostalCode] = useState(saved.postalCode || '');
  const [country, setCountry] = useState(saved.country || 'India');

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
    navigate('/placeorder');
  };

  return (
    <div>
      {/* Steps */}
      <div className="steps">
        <span className="step">🛒 Cart</span>
        <span className="step-divider">›</span>
        <span className="step active">📦 Delivery Address</span>
        <span className="step-divider">›</span>
        <span className="step">💳 Order Summary</span>
        <span className="step-divider">›</span>
        <span className="step">✅ Payment</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        {/* Form */}
        <div className="card animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2874f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>1</div>
            <h2 style={{ fontSize: 18, fontWeight: 500 }}>Delivery Address</h2>
          </div>

          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label>Full Delivery Address</label>
              <input type="text" className="form-control" placeholder="House No., Building, Street, Area" value={address}
                onChange={e => setAddress(e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>City / District / Town</label>
                <input type="text" className="form-control" placeholder="City" value={city}
                  onChange={e => setCity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" className="form-control" placeholder="6-digit pincode" value={postalCode}
                  onChange={e => setPostalCode(e.target.value)} required maxLength={6} />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <select className="form-control" value={country} onChange={e => setCountry(e.target.value)}>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </div>
            <button type="submit" className="btn btn-blue" style={{ padding: '12px 48px', fontSize: 15, borderRadius: 2 }}>
              Continue &nbsp;<i className="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>

        {/* Order Preview */}
        <div className="price-box">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: 8, marginBottom: 12, fontSize: 13, alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'contain', border: '1px solid #eee', borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{item.name}</div>
                <div style={{ color: '#878787' }}>Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
          <div className="price-row price-total" style={{ marginTop: 8 }}>
            <span>Total</span>
            <span>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
