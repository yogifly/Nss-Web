import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Use the initialized Firestore instance
import './Main.css';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { useNavigate } from 'react-router-dom';

function Main() {
  const [newVolunteer, setNewVolunteer] = useState({
    pid: '',
    fullname: '',
    email: '',
    class: '',
    phoneno: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedFullname = localStorage.getItem('fullname');
    if (storedFullname) {
      setFullname(storedFullname);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleAddVolunteer = async () => {
    try {
      const volunteerData = {
        ...newVolunteer,
        hoursRegistered: 0
      };
      
      await addDoc(collection(db, 'volunteers'), volunteerData);
      setSuccessMessage('Volunteer added successfully!');
      setNewVolunteer({ pid: '', fullname: '', email: '', class: '', phoneno: '' });

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding volunteer: ', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('fullname');
    localStorage.removeItem('userid');
    navigate('/login');
  };

  return (
    <div>

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

export default Main;
