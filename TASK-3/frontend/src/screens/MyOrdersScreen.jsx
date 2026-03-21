import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const MyOrdersScreen = () => {
  const { userInfo } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null); // order id being cancelled

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userInfo) { setError('Please login to view your orders'); setLoading(false); return; }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: 36, color: '#2874f0' }}></i>
      <p style={{ marginTop: 12, color: '#878787' }}>Loading your orders...</p>
    </div>
  );
  if (error) return (
    <div className="card" style={{ textAlign: 'center', padding: 40 }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: 40, color: '#ff6161', marginBottom: 12, display: 'block' }}></i>
      <p style={{ color: '#ff6161' }}>{error}</p>
      <Link to="/login" className="btn btn-blue" style={{ marginTop: 16, display: 'inline-flex' }}>Login</Link>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ background: '#fff', borderRadius: 4, padding: '16px 20px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>My Orders</h2>
          <p style={{ fontSize: 13, color: '#878787', marginTop: 2 }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <Link to="/" style={{ fontSize: 13, color: '#2874f0' }}>← Continue Shopping</Link>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-box-open" style={{ fontSize: 64, color: '#ccc', display: 'block', marginBottom: 16 }}></i>
          <h3 style={{ fontWeight: 400, color: '#878787', marginBottom: 8 }}>No orders yet!</h3>
          <p style={{ color: '#aaa', fontSize: 13, marginBottom: 20 }}>You haven't placed any orders. Start shopping now.</p>
          <Link to="/" className="btn btn-blue" style={{ display: 'inline-flex' }}>Shop Now</Link>
        </div>
      ) : (
        <div>
          {orders.map(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            return (
              <div key={order._id} className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 10 }}>
                {/* Order Header */}
                <div style={{ background: '#f9f9f9', borderBottom: '1px solid #f0f0f0', padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                    <div>
                      <div style={{ color: '#878787', marginBottom: 2, fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Order Placed</div>
                      <div style={{ fontWeight: 500 }}>{date}</div>
                    </div>
                    <div>
                      <div style={{ color: '#878787', marginBottom: 2, fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
                      <div style={{ fontWeight: 500 }}>₹{order.totalPrice?.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ color: '#878787', marginBottom: 2, fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Payment</div>
                      <div style={{ fontWeight: 500, color: order.isPaid ? '#388e3c' : '#ff6161' }}>
                        {order.isPaid ? '✓ Paid' : '✗ Not Paid'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{
                      background: order.isCancelled ? '#f5f5f5' : order.isDelivered ? '#e8f5e9' : order.isPaid ? '#e3f2fd' : '#fce4ec',
                      color: order.isCancelled ? '#aaa' : order.isDelivered ? '#388e3c' : order.isPaid ? '#1976d2' : '#c62828',
                      padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600
                    }}>
                      {order.isCancelled ? '✕ Cancelled' : order.isDelivered ? '✓ Delivered' : order.isPaid ? '⏳ Processing' : '⚠ Pending'}
                    </span>
                    <Link to={`/order/${order._id}`} style={{
                      fontSize: 13, color: '#2874f0', fontWeight: 500,
                      border: '1px solid #2874f0', borderRadius: 2, padding: '5px 12px'
                    }}>View Details</Link>
                    {!order.isPaid && !order.isDelivered && !order.isCancelled && (
                      <button
                        onClick={async () => {
                          if (!window.confirm('Cancel this order?')) return;
                          setCancelling(order._id);
                          try {
                            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                            await axios.put(`/api/orders/${order._id}/cancel`, {}, config);
                            setOrders(prev => prev.map(o => o._id === order._id ? { ...o, isCancelled: true } : o));
                            showToast('Order cancelled successfully', 'info');
                          } catch (err) {
                            showToast(err.response?.data?.message || 'Cancel failed', 'error');
                          } finally {
                            setCancelling(null);
                          }
                        }}
                        disabled={cancelling === order._id}
                        style={{ fontSize: 13, color: '#ff6161', fontWeight: 500, border: '1px solid #ff6161', borderRadius: 2, padding: '5px 12px', background: 'none', cursor: 'pointer', fontFamily: 'Roboto' }}
                      >
                        {cancelling === order._id ? 'Cancelling…' : 'Cancel Order'}
                      </button>
                    )}
                    {order.isCancelled && (
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this order?')) return;
                          setCancelling(order._id);
                          try {
                            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                            await axios.delete(`/api/orders/${order._id}`, config);
                            setOrders(prev => prev.filter(o => o._id !== order._id));
                            showToast('Order removed from history', 'info');
                          } catch (err) {
                            showToast(err.response?.data?.message || 'Delete failed', 'error');
                          } finally {
                            setCancelling(null);
                          }
                        }}
                        disabled={cancelling === order._id}
                        style={{ fontSize: 13, color: '#878787', fontWeight: 500, border: '1px solid #878787', borderRadius: 2, padding: '5px 12px', background: 'none', cursor: 'pointer', fontFamily: 'Roboto' }}
                      >
                        {cancelling === order._id ? 'Removing…' : 'Remove Order'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                {order.orderItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f9f9f9', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: 72, height: 72, objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: 2, flexShrink: 0, padding: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#878787' }}>Qty: {item.qty} &nbsp;|&nbsp; ₹{item.price.toLocaleString('en-IN')} each</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: '#212121' }}>₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/product/${item.product}`} style={{ fontSize: 12, color: '#2874f0', border: '1px solid #2874f0', borderRadius: 2, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                        Buy Again
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Payment method */}
                <div style={{ padding: '8px 16px', fontSize: 12, color: '#878787', borderTop: '1px solid #f9f9f9' }}>
                  Payment: {order.paymentMethod} &nbsp;|&nbsp;
                  Shipped to: {order.shippingAddress?.city}, {order.shippingAddress?.country} &nbsp;|&nbsp;
                  Order ID: <span style={{ fontFamily: 'monospace' }}>{order._id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersScreen;
