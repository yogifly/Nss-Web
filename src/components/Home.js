import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
  const [fullname, setFullname] = useState(''); // State to store fullname
  const [email, setEmail] = useState(''); // State to store email
  const navigate = useNavigate();

  useEffect(() => {
    const storedFullname = localStorage.getItem('fullname');
    const storedEmail = localStorage.getItem('username');
    
    if (storedFullname && storedEmail) {
      setFullname(storedFullname);
      setEmail(storedEmail);
    } else {
      navigate('/login'); // Redirect to login if no fullname or email is found
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('fullname');
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    navigate('/login');
  };

  return (
    <div className="nss-app">
    <header className="nss-navbar">
      <div className="nss-logo">
        <h1>NSS App</h1>
      </div>
  
      <nav className="nss-nav-links">
        <a href="/about" className="nss-nav-link">About Us</a>
        <a href="/gallery" className="nss-nav-link">Gallery</a>
        <a href="#achievements" className="nss-nav-link">Achievements</a>
        <a href="/volunteers/events" className="nss-nav-link">Events</a>
        <a href="/contact" className="nss-nav-link">Contact Information</a>
        <a href="#news" className="nss-nav-link">News & Announcements</a>
        <a href="#volunteer" className="nss-nav-link">Volunteer</a>
        <a href="/profile" className="nss-nav-link">Profile</a>
      </nav>
  
      <div className="nss-profile-section">
        <span className="nss-username">Welcome, {fullname}</span>
        <button onClick={handleLogout} className="nss-logout-button">Logout</button>
      </div>
    </header>
  
    <main className="nss-main-content">
      <header className="nss-header">
        <h2>Welcome to NSS App</h2>
        <p>Your one-stop solution for all things tech!</p>
      </header>
    </main>
  </div>
  
  );
}

export default Home;
