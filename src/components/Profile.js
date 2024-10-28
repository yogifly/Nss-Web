import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Your firebase configuration
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user details from localStorage
    const username = localStorage.getItem('username');
    const fullname = localStorage.getItem('fullname');
    const userId = localStorage.getItem('userid');
    const userType = localStorage.getItem('userType');

    // Check if user is logged in, if not, redirect to login page
    if (!username || !fullname || !userId || !userType) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      // Fetch additional user details from Firestore
      fetchUserDetails(userType, userId);
    }
  }, [navigate]);

  const fetchUserDetails = async (userType, userId) => {
    try {
      // Determine the collection based on userType
      const collectionName = userType === 'head' ? 'heads' : 'volunteers';
      const docRef = doc(db, collectionName, userId); // Create a reference to the document

      // Fetch the document from Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Set the user details in state
        setUserDetails(docSnap.data());
      } else {
        console.error('No such user found in Firestore.');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
    }
  };

  const renderInfographic = (hoursRegistered) => {
    const maxHours = 120; // Set the maximum hours
    const percentage = (hoursRegistered / maxHours) * 100;

    return (
      <div className="infographic-container">
        <div className="infographic">
          <div
            className="infographic-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="infographic-text">
          {hoursRegistered} / {maxHours} hours registered
        </p>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Optional loading state
  }

  return (
    <div className="profile-container">
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
  );
};

export default Profile;
