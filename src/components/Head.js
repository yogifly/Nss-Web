import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Use the initialized Firestore instance
import './Head.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Head() {
  const [newVolunteer, setNewVolunteer] = useState({
    pid: '',
    fullname: '',
    email: '',
    class: '',
    phoneno: ''
  });

  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Retrieve fullname from local storage
    const storedFullname = localStorage.getItem('fullname');
    if (storedFullname) {
      setFullname(storedFullname);
    } else {
      navigate('/login'); // Redirect to login if no fullname is found
    }
  }, [navigate]);

  // Add Volunteer to Firestore
  const handleAddVolunteer = async () => {
    try {
      const volunteerData = {
        ...newVolunteer,
        hoursRegistered: 0 // Add hoursRegistered with a default value of 0 without displaying it in the form
      };
      
      await addDoc(collection(db, 'volunteers'), volunteerData); // Add volunteer to Firestore
      setSuccessMessage('Volunteer added successfully!'); // Set success message
      setNewVolunteer({ pid: '', fullname: '', email: '', class: '', phoneno: '' }); // Clear the form

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding volunteer: ', error);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('username'); // Remove the username from local storage
    localStorage.removeItem('fullname'); // Remove fullname from local storage
    localStorage.removeItem('userid'); // Remove userId from local storage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Heads Dashboard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/head/manage-volunteers">Manage Volunteers</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/volunteers/events">Events</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/head/add-volunteer">Add Volunteer</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/head/upload-photos">Add Photos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/events">Event Planning</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/report">Report</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/report-page">Report-page</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/response">Give response</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/profile">profile</a>
              </li>
              <li className="nav-item">
                <span className="navbar-text me-2">Welcome, {fullname}</span> {/* Display fullname */}
              </li>
              
              
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-light">Logout</button> {/* Logout button */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="content" style={{ marginTop: '100px' }}>
        <h2>Add New Volunteer</h2>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        <div className="add-volunteer-form">
          <input
            type="text"
            placeholder="PID"
            value={newVolunteer.pid}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, pid: e.target.value })}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={newVolunteer.fullname}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, fullname: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newVolunteer.email}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Class"
            value={newVolunteer.class}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, class: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone No"
            value={newVolunteer.phoneno}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, phoneno: e.target.value })}
          />
          <button onClick={handleAddVolunteer}>Add Volunteer</button>
        </div>
      </div>
    </div>
  );
}

export default Head;
