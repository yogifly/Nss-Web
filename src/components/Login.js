import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Your firebase configuration
import './Login.css';
import 'font-awesome/css/font-awesome.min.css'; // Font Awesome

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('head'); // Default role is head
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Set Firebase auth persistence to keep the session alive
      await setPersistence(auth, browserLocalPersistence);

      // Authenticate the user via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      if (userType === 'admin') {
        // Admin login check
        if (username === 'ingleyogesh2004@gmail.com' && password === 'admin1') {
          localStorage.setItem('username', username);
          navigate('/admin'); // Admin users redirected to Admin page
        } else {
          alert('Invalid admin credentials');
        }
      } else {
        // For head or volunteer, query Firestore based on the role
        let userQuery;
        if (userType === 'head') {
          // Query the heads collection
          userQuery = query(collection(db, 'heads'), where('email', '==', username));
        } else {
          // Query the volunteers collection
          userQuery = query(collection(db, 'volunteers'), where('email', '==', username));
        }

        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          alert(`You are not authorized as a ${userType}. Please contact the admin.`);
        } else {
          // Extract user details
          const userDoc = querySnapshot.docs[0].data();
          const userName = userType === 'head' ? (userDoc.fullname || userDoc.name) : userDoc.fullname; // Check both fields
          const userId = querySnapshot.docs[0].id; // Get the user ID from Firestore

          // Store the email, fullname, and userId in localStorage
          localStorage.setItem('username', username); // Email
          localStorage.setItem('fullname', userName); // Fullname
          localStorage.setItem('userid', userId);     // User ID
          localStorage.setItem('userType', userType); // Storing userType

          // Alert the fullname, email, and userid
          alert(`Fullname: ${userName}\nEmail: ${username}\nUserID: ${userId}`);

          if (userType === 'head') {
            // Redirect to Head page for head users
            navigate('/head');
          } else {
            // Redirect to Home page for volunteer users
            navigate('/home');
          }
        }
      }
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to NSS</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="user-type">Role</label>
          <select id="user-type" value={userType} onChange={(e) => setUserType(e.target.value)} required>
            <option value="head">Head</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
              onClick={() => setShowPassword(!showPassword)}
              aria-hidden="true"
              aria-label={showPassword ? "Hide password" : "Show password"}
            />
          </div>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
