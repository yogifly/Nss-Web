import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Importing auth from firebase config
import { collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import the function to create a user
import emailjs from 'emailjs-com'; // Importing emailjs
import './HeadList.css';

const HeadList = () => {
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    const fetchHeads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'heads'));
        const headsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHeads(headsList);
      } catch (error) {
        console.error('Error fetching heads:', error);
      }
    };

    fetchHeads();
  }, []);

  // Add head to Firebase Auth and send credentials via email
  const addHeadToAuth = async (email, password) => {
    try {
      // Add head's credentials to Firebase Authentication using email and pid as the password
      await createUserWithEmailAndPassword(auth, email, password);
      alert(`User with email ${email} successfully added to auth.`);

      // Once the user is added to Firebase, send the credentials via EmailJS
      sendCredentials(email, password); // Send the email and password
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + error.message);
    }
  };

  // Send the credentials (email and password) via EmailJS
  const sendCredentials = (email, password) => {
    const templateParams = {
      to_email: email, // The recipient's email (head's email)
      password: password, // The password for the new user
    };

    emailjs.send('service_cn84d3i', 'template_9obfrb9', templateParams, '2DARz548nH1T7KPJ7')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert(`Credentials sent to ${email}`);
      })
      .catch((err) => {
        console.error('FAILED...', err);
        alert(`Failed to send email to ${email}. Error: ${err.text}`);
      });
  };

  return (
    <div className="head-list-container">
      <h1>List of Heads</h1>
      {heads.length > 0 ? (
        <ul className="head-list">
          {heads.map((head) => (
            <li key={head.id} className="head-item">
              <h2 style={{ color: 'blue', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {head.fullname}
              </h2> {/* Display fullname with inline CSS */}
              <p>ID: {head.pid}</p>
              <p>Email: {head.email}</p>
              {/* Add button for each head to add credentials to Firebase Authentication */}
              <button
                onClick={() => addHeadToAuth(head.email, head.pid)} // Use pid as the password
                className="add-to-auth-btn"
              >
                Add to Auth
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No heads found.</p>
      )}
    </div>
  );
};

export default HeadList;
