import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Product = ({ product }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const wishlisted = isWishlisted(product._id);
  const mrp = Math.round(product.price * 1.2);
  const discount = Math.round(((mrp - product.price) / mrp) * 100);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', wishlisted ? 'info' : 'success');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock === 0) return;
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card animate-fade-in">
        {/* Wishlist */}
        <button className={`wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={handleWishlist}>
          <i className={wishlisted ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>

        {/* Image */}
        <div className="product-image-container">
          {product.countInStock === 0 && (
            <div className="out-of-stock-badge">OUT OF STOCK</div>
          )}
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        {/* Body */}
        <div className="product-body">
          <div className="product-title">{product.name}</div>

          {product.rating > 0 && (
            <div style={{ marginBottom: 6 }}>
              <span className="product-rating">
                {product.rating} <i className="fas fa-star" style={{ fontSize: 10 }}></i>
              </span>
              <span style={{ fontSize: 12, color: '#878787', marginLeft: 6 }}>({product.numReviews})</span>
            </div>
          )}

          <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
          <div>
            <span className="product-mrp">₹{mrp.toLocaleString('en-IN')}</span>
            <span className="product-discount">{discount}% off</span>
          </div>
          <div style={{ fontSize: 12, color: '#388e3c', marginTop: 4 }}>Free Delivery</div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            style={{
              marginTop: 10,
              width: '100%',
              background: product.countInStock === 0 ? '#ccc' : '#ff9f00',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              padding: '7px 0',
              fontSize: 13,
              fontWeight: 600,
              cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            <i className="fas fa-shopping-cart" style={{ marginRight: 6 }}></i>
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Product;
