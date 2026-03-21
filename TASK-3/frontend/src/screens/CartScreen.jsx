import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartScreen = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice > 499 ? 0 : 40;
  const totalPrice = itemsPrice + shippingPrice;
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const savings = cartItems.reduce((acc, item) => {
    const mrp = Math.round(item.price * 1.2);
    return acc + (mrp - item.price) * item.qty;
  }, 0);

  const checkoutHandler = () => navigate('/login?redirect=/checkout');

  const removeItem = (id, name) => {
    removeFromCart(id);
    showToast(`${name} removed from cart`, 'info');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, alignItems: 'start' }}>
      {/* Cart Items */}
      <div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 500 }}>My Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>
            <Link to="/" style={{ fontSize: 13, color: '#2874f0' }}>Continue Shopping</Link>
          </div>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <i className="fas fa-shopping-cart" style={{ fontSize: 56, color: '#ccc', display: 'block', marginBottom: 16 }}></i>
              <h3 style={{ color: '#878787', fontWeight: 400, marginBottom: 4 }}>Your cart is empty!</h3>
              <p style={{ color: '#aaa', fontSize: 13, marginBottom: 20 }}>Add items to continue shopping</p>
              <Link to="/" className="btn btn-blue" style={{ display: 'inline-flex' }}>Shop Now</Link>
            </div>
          ) : (
            cartItems.map(item => {
              const mrp = Math.round(item.price * 1.2);
              const disc = Math.round(((mrp - item.price) / mrp) * 100);
              return (
                <div key={item._id} className="cart-item">
                  <Link to={`/product/${item._id}`}>
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item._id}`} style={{ color: '#212121', fontSize: 14 }}>{item.name}</Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0' }}>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>₹{item.price.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 13, color: '#878787', textDecoration: 'line-through' }}>₹{mrp.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 13, color: '#388e3c', fontWeight: 500 }}>{disc}% off</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#388e3c' }}>✓ Free Delivery</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden' }}>
                        <button onClick={() => item.qty > 1 ? addToCart(item, item.qty - 1) : removeItem(item._id, item.name)}
                          style={{ background: '#f0f0f0', border: 'none', width: 32, height: 32, cursor: 'pointer', fontSize: 16, fontFamily: 'Roboto' }}>−</button>
                        <span style={{ padding: '0 16px', fontSize: 14, fontWeight: 500 }}>{item.qty}</span>
                        <button onClick={() => addToCart(item, item.qty + 1)}
                          disabled={item.qty >= item.countInStock}
                          style={{ background: '#f0f0f0', border: 'none', width: 32, height: 32, cursor: 'pointer', fontSize: 16, fontFamily: 'Roboto' }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item._id, item.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#878787', fontSize: 13, fontWeight: 500, fontFamily: 'Roboto' }}>
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {cartItems.length > 0 && (
            <div style={{ padding: '16px 20px', textAlign: 'right', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button className="btn btn-blue" style={{ padding: '12px 48px', fontSize: 15, borderRadius: 2 }} onClick={checkoutHandler}>
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price Summary */}
      {cartItems.length > 0 && (
        <div className="price-box" style={{ position: 'sticky', top: 80 }}>
          <h3>Price Details</h3>
          <div className="price-row">
            <span>Price ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
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
          <div className="price-row price-total">
            <span>Total Amount</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          {savings > 0 && (
            <p className="price-saving" style={{ marginTop: 10, fontSize: 13 }}>
              You will save ₹{savings.toLocaleString('en-IN')} on this order
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CartScreen;
