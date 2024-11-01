import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const fullname = localStorage.getItem('fullname');
    const userId = localStorage.getItem('userid');
    const userType = localStorage.getItem('userType');

    if (!username || !fullname || !userId || !userType) {
      navigate('/login');
    } else {
      fetchUserDetails(userType, userId);
    }
  }, [navigate]);

  const fetchUserDetails = async (userType, userId) => {
    try {
      const collectionName = userType === 'head' ? 'heads' : 'volunteers';
      const docRef = doc(db, collectionName, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
      } else {
        console.error('No such user found in Firestore.');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInfographic = (hoursRegistered) => {
    const maxHours = 120;
    const percentage = (hoursRegistered / maxHours) * 100;

    return (
      <div className="infographic-container">
        <div className="infographic">
          <div className="infographic-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="infographic-text">
          {hoursRegistered} / {maxHours} hours registered
        </p>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* Left Column */}
      <div className="profile-left">
        <h2>User Profile</h2>
        {userDetails ? (
          <>
            <div className="profile-info">
              <h3>Welcome, {userDetails.fullname}!</h3>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Class:</strong> {userDetails.class}</p>
              <p><strong>Phone No:</strong> {userDetails.phoneno}</p>
              <p><strong>PID:</strong> {userDetails.pid}</p>
              <p><strong>User Type:</strong> {localStorage.getItem('userType')}</p>
            </div>
            <div className="hours-container">
              <h4>Hours Registered:</h4>
              {renderInfographic(userDetails.hoursRegistered)}
            </div>
          </>
        ) : (
          <p>No user details found.</p>
        )}
      </div>

      {/* Right Column */}
      <div className="profile-right">
        <h4>Events Registered:</h4>
        {userDetails && userDetails.EventsRegistered && userDetails.EventsRegistered.length > 0 ? (
          userDetails.EventsRegistered.map((event, index) => (
            <div
              key={index}
              className={`event-item ${event.status === 'present' ? 'event-present' : 'event-pending'}`}
            >
              <p><strong>Event Name:</strong> {event.eventname}</p>
              <p><strong>Status:</strong> {event.status ?? 'Pending'}</p>
            </div>
          ))
        ) : (
          <p>No events registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
