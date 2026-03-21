import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const searchHandler = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/');
    }
    setSearch('');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div>
            <span className="logo-text">E-Shop <em style={{ fontStyle: 'italic', color: '#ffe500', fontSize: '20px' }}>Pro</em></span>
            <span className="logo-tagline">Explore Plus ✦</span>
          </div>
        </Link>

        {/* Search */}
        <form className="header-search" onSubmit={searchHandler} style={{ flex: 1, maxWidth: 680 }}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        {/* Nav */}
        <div className="header-nav">
          {userInfo ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <i className="fas fa-user-circle" style={{ fontSize: 18, color: '#fff' }}></i>
              <span style={{ color: '#fff', fontSize: 13 }}>{userInfo.name.split(' ')[0]}</span>
              <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                <Link to="/myorders" style={{ color: '#ffe500', fontSize: 11, fontWeight: 500 }}>Orders</Link>
                {userInfo.isAdmin && <Link to="/admin" style={{ color: '#ccc', fontSize: 11 }}>Admin</Link>}
                <span onClick={logout} style={{ color: '#ffcccc', fontSize: 11, cursor: 'pointer' }}>Logout</span>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-item" style={{ textDecoration: 'none' }}>
              <i className="fas fa-user"></i>
              <span>Login</span>
            </Link>
          )}

          <Link to="/" className="nav-item" style={{ textDecoration: 'none' }}>
            <i className="fas fa-heart"></i>
            <span>Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ''}</span>
          </Link>

          <Link to="/cart" className="nav-item" style={{ textDecoration: 'none', position: 'relative' }}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <i className="fas fa-shopping-cart" style={{ fontSize: 20 }}></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </span>
            <span>Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub-nav — Category Filter */}
      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '6px 0' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 16px', display: 'flex', gap: 24, fontSize: 13, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[['All', '/'], ['Mobiles', '/?category=Mobiles'], ['Electronics', '/?category=Electronics'], ['Fashion', '/?category=Fashion'], ['Appliances', '/?category=Appliances'], ['Gaming', '/?category=Gaming'], ['Grocery', '/?category=Grocery'], ['Furniture', '/?category=Furniture']].map(([cat, path]) => (
            <Link key={cat} to={path} style={{ color: '#fff', fontWeight: 500, opacity: 0.9, whiteSpace: 'nowrap' }}>{cat}</Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
