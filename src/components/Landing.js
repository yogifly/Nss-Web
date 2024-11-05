import React from 'react';
import Navbar from './Navbar';
import About from './About';
import Contact from './Contact';
import Gallery from './Gallery1';
import './Landing.css';

const Landing = () => {
  return (
    <>
    <Navbar />
    <header>
      <h1>Welcome to NSS Website</h1>
    </header>
  
    {/* Wrapper to contain main content and footer in the viewport */}
    <div className="content-wrapper">
      <div className="main-content">
        <About />
        <Gallery />
        <Contact />
      </div>
    </div>
  
    {/* Footer section */}
    <footer className="footer">
      <div className="footer-container">
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
  
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@nsswebsite.com</p>
          <p>Phone: +91 12345 67890</p>
          <p>Address: NSS Office, University Campus</p>
        </div>
  
        
  
        <div className="footer-section">
          <h3>Newsletter</h3>
          <form>
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </form>
        </div>
      </div>
  
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NSS SFIT. All rights reserved.</p>
      </div>
    </footer>
  </>
  

  );
};

export default Landing;
