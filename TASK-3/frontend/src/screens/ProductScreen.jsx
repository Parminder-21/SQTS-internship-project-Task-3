import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const StarRating = ({ value, onRate }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}
          onMouseEnter={() => onRate && setHovered(star)}
          onMouseLeave={() => onRate && setHovered(0)}
          onClick={() => onRate && onRate(star)}
          style={{ cursor: onRate ? 'pointer' : 'default' }}>
          <i
            className={star <= (hovered || value) ? 'fas fa-star' : 'far fa-star'}
            style={{ color: '#f9a825', fontSize: 18 }}
          />
        </span>
      ))}
    </div>
  );
};

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`, 'success');
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) { showToast('Please login to write a review', 'error'); return; }
    if (rating === 0) { showToast('Please select a star rating', 'error'); return; }
    try {
      setSubmitting(true);
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
      showToast('Review submitted! ✓', 'success');
      setRating(0);
      setComment('');
      fetchProduct();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: 36, color: '#2874f0' }}></i>
    </div>
  );
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!product) return null;

  const mrp = Math.round(product.price * 1.2);
  const discount = Math.round(((mrp - product.price) / mrp) * 100);
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: 12 }}>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/?category=${product.category}`}>{product.category}</Link>
        <span>›</span>
        <span style={{ color: '#212121' }}>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr 300px', gap: 0 }}>
          
          {/* Image Column */}
          <div style={{ padding: 24, borderRight: '1px solid #f0f0f0', position: 'sticky', top: 80, alignSelf: 'start' }}>
            <div style={{ position: 'relative' }}>
              <img src={product.image} alt={product.name}
                style={{ width: '100%', height: 320, objectFit: 'contain' }} />
              <button
                onClick={() => { toggleWishlist(product); showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', wishlisted ? 'info' : 'success'); }}
                style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: '1px solid #ddd', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: wishlisted ? '#ff6161' : '#aaa', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                <i className={wishlisted ? 'fas fa-heart' : 'far fa-heart'}></i>
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <button className="btn btn-blue" style={{ flex: 1, borderRadius: 2, padding: 12, fontSize: 14 }}
                disabled={product.countInStock === 0} onClick={addToCartHandler}>
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
              <button className="btn" style={{ flex: 1, borderRadius: 2, padding: 12, fontSize: 14, background: '#fb641b' }}
                disabled={product.countInStock === 0}
                onClick={() => { addToCart(product, qty); navigate('/checkout'); }}>
                <i className="fas fa-bolt"></i> Buy Now
              </button>
            </div>
          </div>

          {/* Info Column */}
          <div style={{ padding: '24px 20px', borderRight: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: 12, color: '#878787', marginBottom: 4, textTransform: 'uppercase' }}>{product.brand}</p>
            <h1 style={{ fontSize: 20, fontWeight: 400, marginBottom: 12 }}>{product.name}</h1>

            {/* Rating Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ background: '#388e3c', color: '#fff', padding: '3px 8px', borderRadius: 3, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {product.rating} <i className="fas fa-star" style={{ fontSize: 11 }}></i>
              </span>
              <span style={{ color: '#878787', fontSize: 14 }}>{product.numReviews} Ratings &amp; Reviews</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 700, marginRight: 8 }}>₹{product.price.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: 14, color: '#878787', textDecoration: 'line-through', marginRight: 8 }}>₹{mrp.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: 16, color: '#388e3c', fontWeight: 600 }}>{discount}% off</span>
            </div>

            {/* Tabs: Description / Specs / Delivery */}
            <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 16, display: 'flex', gap: 0 }}>
              {['description', 'specs', 'delivery'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? '3px solid #2874f0' : '3px solid transparent', padding: '10px 16px', cursor: 'pointer', fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#2874f0' : '#212121', textTransform: 'capitalize', fontFamily: 'Roboto', fontSize: 14 }}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>{product.description}</p>
            )}
            {activeTab === 'specs' && (
              <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                <tbody>
                  {[['Brand', product.brand], ['Category', product.category], ['Rating', `${product.rating} / 5`], ['Reviews', product.numReviews], ['Availability', product.countInStock > 0 ? `In Stock (${product.countInStock} units)` : 'Out of Stock']].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 0', color: '#878787', width: 140 }}>{k}</td>
                      <td style={{ padding: '10px 0', fontWeight: 500 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'delivery' && (
              <div style={{ fontSize: 14, color: '#555', lineHeight: 2 }}>
                <p><i className="fas fa-truck" style={{ color: '#2874f0', marginRight: 8 }}></i>Free Delivery on orders above ₹499</p>
                <p><i className="fas fa-undo" style={{ color: '#2874f0', marginRight: 8 }}></i>7-day easy return policy</p>
                <p><i className="fas fa-shield-alt" style={{ color: '#2874f0', marginRight: 8 }}></i>1-year manufacturer warranty</p>
                <p><i className="fas fa-check-circle" style={{ color: '#388e3c', marginRight: 8 }}></i>Genuine product guarantee</p>
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: product.countInStock > 0 ? '#388e3c' : '#ff6161', fontWeight: 600, marginBottom: 12 }}>
              {product.countInStock > 0 ? `✓ In Stock (${product.countInStock} left)` : '✗ Out of Stock'}
            </div>
            {product.countInStock > 0 && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, color: '#878787', marginBottom: 6, display: 'block' }}>Quantity</label>
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))}
                    style={{ width: 80, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 2, fontSize: 14 }}>
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div style={{ fontSize: 13, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#555' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#2874f0', width: 16 }}></i>
                Delivery in 2–5 business days
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#555' }}>
                <i className="fas fa-undo" style={{ color: '#2874f0', width: 16 }}></i>
                7 Days Return Policy
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#555' }}>
                <i className="fas fa-shield-alt" style={{ color: '#2874f0', width: 16 }}></i>
                Warranty: 1 Year
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
          Ratings &amp; Reviews
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
          {/* Aggregate score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: '#212121', lineHeight: 1 }}>{product.rating}</div>
            <StarRating value={Math.round(product.rating)} />
            <div style={{ fontSize: 13, color: '#878787', marginTop: 6 }}>{product.numReviews} Reviews</div>
          </div>
          {/* Rating Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = product.reviews?.filter(r => Math.round(r.rating) === star).length || 0;
              const pct = product.reviews?.length ? Math.round((count / product.reviews.length) * 100) : 0;
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <span style={{ width: 20, textAlign: 'right' }}>{star}</span>
                  <i className="fas fa-star" style={{ color: '#f9a825', fontSize: 11 }}></i>
                  <div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: star >= 4 ? '#388e3c' : star === 3 ? '#f9a825' : '#ff6161', borderRadius: 4 }} />
                  </div>
                  <span style={{ color: '#878787', width: 28 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write a Review */}
        {userInfo ? (
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Write a Review</h3>
            <form onSubmit={submitReviewHandler}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: '#878787', display: 'block', marginBottom: 6 }}>Your Rating *</label>
                <StarRating value={rating} onRate={setRating} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: '#878787', display: 'block', marginBottom: 6 }}>Your Review</label>
                <textarea
                  rows={4} className="form-control"
                  placeholder="Share your experience with this product..."
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn btn-blue" style={{ borderRadius: 2, padding: '10px 28px' }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ padding: '16px', background: '#f1f3f6', borderRadius: 4, marginBottom: 24, fontSize: 14 }}>
            <Link to="/login" style={{ color: '#2874f0', fontWeight: 600 }}>Login</Link> to write a review.
          </div>
        )}

        {/* Review List */}
        {product.reviews?.length === 0 ? (
          <p style={{ color: '#878787', fontSize: 14 }}>No reviews yet. Be the first to review this product!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {product.reviews?.map(review => (
              <div key={review._id} style={{ paddingBottom: 20, borderBottom: '1px solid #f9f9f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2874f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    {review.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: '#878787' }}>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', background: review.rating >= 4 ? '#388e3c' : review.rating >= 3 ? '#f9a825' : '#ff6161', color: '#fff', padding: '2px 8px', borderRadius: 3, fontSize: 13, fontWeight: 600 }}>
                    {review.rating} <i className="fas fa-star" style={{ fontSize: 10 }}></i>
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, paddingLeft: 48 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductScreen;
