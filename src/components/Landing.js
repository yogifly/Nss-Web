import React from 'react';
import Navbar from './Navbar'; // Import your Navbar component
import About from './About';
import Contact from './Contact';
import Gallery from './Gallery1';
import './Landing.css'; // Import your CSS file

const Landing = () => {
  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <header>
        <h1>Welcome to NSS Website</h1>
      </header>

      <div>
        {/* Display all sections */}
        <About />
        <Gallery />
        <Contact />
      </div>

      {/* Footer Component */}
      <footer className="footer">
        <div className="footer-container">
          {/* Company Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@nsswebsite.com</p>
            <p>Phone: +91 12345 67890</p>
            <p>Address: NSS Office, University Campus</p>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-media">
              <a href="https://instagram.com/yourbrand" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://facebook.com/yourbrand" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/yourbrand" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://pinterest.com/yourbrand" className="social-link">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3>Newsletter</h3>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} NSS SFIT. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Landing;
