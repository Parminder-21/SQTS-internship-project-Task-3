import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';

const HomeScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (activeCategory) params.set('category', activeCategory);
        const { data } = await axios.get(`/api/products?${params.toString()}`);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, activeCategory]);

  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#878787' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: 36, color: '#2874f0' }}></i>
      <p style={{ marginTop: 16, fontSize: 16 }}>Loading products...</p>
    </div>
  );
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

  return (
    <div className="animate-fade-in">
      {/* Banner — only on home without filters */}
      {!keyword && !activeCategory && (
        <div className="banner" style={{ marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🛍️ Biggest Deals of the Day</h1>
            <p style={{ opacity: 0.9, marginBottom: 16 }}>Shop premium electronics, fashion & more — free delivery on orders above ₹499</p>
            <button className="btn" style={{ background: '#ffe500', color: '#2874f0', fontWeight: 700 }}
              onClick={() => window.scrollTo({ top: 450, behavior: 'smooth' })}>
              Shop Now &nbsp;<i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* Trending – only on home page with no filters */}
      {!keyword && !activeCategory && trending.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div className="section-header" style={{ borderBottom: '3px solid #2874f0' }}>
            <h2>🔥 Top Rated Products</h2>
          </div>
          <div style={{ background: '#fff', padding: 16, borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div className="trending-strip">
              {trending.map(product => <Product key={product._id} product={product} />)}
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div>
        <div className="section-header" id="products" style={{ borderBottom: '3px solid #2874f0' }}>
          <h2>
            {keyword ? `Results for "${keyword}"` : activeCategory ? `${activeCategory}` : '🛒 All Products'}
            {products.length > 0 && (
              <span style={{ fontSize: 14, color: '#878787', fontWeight: 400, marginLeft: 8 }}>
                ({products.length} products)
              </span>
            )}
          </h2>
          {(keyword || activeCategory) && (
            <span onClick={() => setSearchParams({})} style={{ fontSize: 13, color: '#2874f0', cursor: 'pointer' }}>
              ✕ Clear Filters
            </span>
          )}
        </div>
        <div style={{ background: '#fff', padding: 16, borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#878787' }}>
              <i className="fas fa-search" style={{ fontSize: 36, marginBottom: 16, display: 'block' }}></i>
              <p>No products found.</p>
              <span onClick={() => setSearchParams({})} style={{ marginTop: 16, display: 'inline-flex', cursor: 'pointer', color: '#2874f0', fontWeight: 600 }}>
                Browse All Products →
              </span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {products.map(product => <Product key={product._id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
