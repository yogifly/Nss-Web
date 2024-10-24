import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import './Home.css';

function Home() {
  const [fullname, setFullname] = useState(''); // State to store fullname
  const [email, setEmail] = useState(''); // State to store email
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Retrieve the fullname and email from local storage
    const storedFullname = localStorage.getItem('fullname');
    const storedEmail = localStorage.getItem('username'); // Assuming you store the email as 'username'
    
    if (storedFullname && storedEmail) {
      setFullname(storedFullname); // Set fullname from localStorage
      setEmail(storedEmail); // Set email from localStorage
    } else {
      navigate('/login'); // Redirect to login if no fullname or email is found
    }
  }, [navigate]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('fullname'); // Remove fullname from local storage
    localStorage.removeItem('username'); // Remove email (username) from local storage
    localStorage.removeItem('userid');   // Remove user ID from local storage (if applicable)
    navigate('/'); // Redirect to the login page
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>MyApp</h1>
        </div>
        <div className="navbar-left">
          <a href="/about">About Us</a>
          <a href="/gallery">Gallery</a>
          <a href="#achievements">Achievements</a>

          {/* Dropdown */}
          <div className="dropdown">
            <button className="dropbtn">More</button>
            <div className="dropdown-content">
              <a href="/volunteers/events">Events</a>
              <a href="/contact">Contact Information</a>
              <a href="#news">News & Announcements</a>
              <a href="#volunteer">Volunteer</a>
            </div>
          </div>
        </div>

        <div className="profile-section">
          {/* Display Fullname and Email in the Navbar */}
          <span className="username">Welcome, {fullname}</span>
          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      <header className="header">
        <h2>Welcome to MyApp</h2>
        <p>Your one-stop solution for all things tech!</p>
      </header>
    </div>
  );
}

export default Home;
