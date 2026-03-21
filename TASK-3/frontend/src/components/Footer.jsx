import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <h4>About</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Corporate Info</a></li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><Link to="/myorders">My Orders</Link></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns &amp; Refunds</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Policy</h4>
          <ul>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4>Social</h4>
          <ul>
            <li><a href="#"><i className="fab fa-facebook"></i> Facebook</a></li>
            <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
            <li><a href="#"><i className="fab fa-youtube"></i> YouTube</a></li>
            <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li style={{ color: '#ccc', fontSize: 13, marginBottom: 8 }}>
              <i className="fas fa-envelope" style={{ marginRight: 6 }}></i>support@eshoppro.in
            </li>
            <li style={{ color: '#ccc', fontSize: 13 }}>
              <i className="fas fa-phone" style={{ marginRight: 6 }}></i>1800-000-0000
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} <strong style={{ color: '#fff' }}>E-Shop Pro</strong>. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
