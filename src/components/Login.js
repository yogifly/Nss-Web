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

  const styles = {
    loginContainer: {
      width: "500px",
      padding: "20px",
      backgroundColor: "#F0F4FA",
      borderRadius: "10px",
      borderTop: "5px solid #133E87",
      borderBottom: "5px solid #133E87",
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      fontFamily: "'Source Sans Pro', sans-serif",
      marginTop: "20px"
    },
    header: {
      color: "#133E87",
      fontSize: "24px",
      fontWeight: "400",
      marginBottom: "30px",
    },
    inputGroup: {
      margin: "20px auto",
      width: "100%",
      textAlign: "left",
    },
    label: {
      color: "#1A1A19",
      fontSize: "14px",
      display: "block",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "14px 12px",
      background: "#E5ECF4",
      color: "#133E87",
      border: "1px solid #BFECFF",
      borderRadius: "10px",
      outline: "none",
      transition: "border 0.3s ease",
    },
    inputFocus: {
      border: "1px solid #133E87",
    },
    passwordInput: {
      position: "relative",
    },
    togglePassword: {
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
      color: "#133E87",
      fontSize: "18px",
      cursor: "pointer",
      transition: "color 0.3s",
    },
    togglePasswordHover: {
      color: "#DA2E2E",
    },
    loginButton: {
      width: "100%",
      padding: "15px 0",
      background: "#DA2E2E",
      color: "#ffffff",
      border: "none",
      borderRadius: "30px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background 0.3s",
      marginTop: "30px",
    },
    loginButtonHover: {
      background: "#B72828",
    },
    loginButtonActive: {
      background: "#9B2121",
    },
    link: {
      color: "#133E87",
      textDecoration: "none",
    },
    linkHover: {
      textDecoration: "underline",
    },
  };

  return (
  <div style={styles.loginContainer}>
    <h2 style={styles.header}>Login to NSS</h2>
    <form onSubmit={handleLogin}>
      <div style={styles.inputGroup}>
        <label htmlFor="user-type" style={styles.label}>
          Role
        </label>
        <select
          id="user-type"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
          style={styles.input}
        >
          <option value="head">Head</option>
          <option value="volunteer">Volunteer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div style={styles.inputGroup}>
        <label htmlFor="username" style={styles.label}>
          Email
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label htmlFor="password" style={styles.label}>
          Password:
        </label>
        <div style={styles.passwordInput}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <i
            className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
            aria-hidden="true"
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={styles.togglePassword}
          />
        </div>
      </div>
      <button type="submit" style={styles.loginButton}>
        Login
      </button>
    </form>
  </div>
);
};

export default Login;
