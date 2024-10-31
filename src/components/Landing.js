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
      <footer
        style={{
          backgroundColor: "#D6E4F0",
          color: "#000000",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          {/* Company Links */}
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Quick Links</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ margin: "5px 0" }}>
                <a href="/" style={{ color: "#000000", textDecoration: "none" }}>Home</a>
              </li>
              <li style={{ margin: "5px 0" }}>
                <a href="/about" style={{ color: "#000000", textDecoration: "none" }}>About Us</a>
              </li>
              <li style={{ margin: "5px 0" }}>
                <a href="#" style={{ color: "#000000", textDecoration: "none" }}>Events</a>
              </li>
              <li style={{ margin: "5px 0" }}>
                <a href="/gallery" style={{ color: "#000000", textDecoration: "none" }}>Gallery</a>
              </li>
              <li style={{ margin: "5px 0" }}>
                <a href="/contact" style={{ color: "#000000", textDecoration: "none" }}>Contact Us</a>
              </li>
            </ul>
          </div>
  
          {/* Customer Service */}
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Contact Us</h3>
            <p>Email: info@nsswebsite.com</p>
            <p>Phone: +91 12345 67890</p>
            <p>Address: NSS Office, University Campus</p>
          </div>
  
          {/* Social Media */}
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Follow Us</h3>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <a href="https://instagram.com/yourbrand" style={{ fontSize: "25px", color: "#333", transition: "color 0.3s ease" }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://facebook.com/yourbrand" style={{ fontSize: "25px", color: "#333", transition: "color 0.3s ease" }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/yourbrand" style={{ fontSize: "25px", color: "#333", transition: "color 0.3s ease" }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://pinterest.com/yourbrand" style={{ fontSize: "25px", color: "#333", transition: "color 0.3s ease" }}>
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
  
          {/* Newsletter */}
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Newsletter</h3>
            <form>
              <input type="email" placeholder="Enter your email" style={{ padding: "5px", marginRight: "5px" }} />
              <button type="submit" style={{ padding: "5px" }}>Subscribe</button>
            </form>
          </div>
        </div>
  
        <div
          style={{
            marginTop: "10px",
            fontSize: "0.8rem",
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} NSS SFIT. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Landing;
