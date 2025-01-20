import React from 'react';
import { Link } from 'react-router-dom';

const EventPage = () => {
  return (
    <div style={styles.pageContainer}>
      <h1>Event Management</h1>
      <div style={styles.buttonContainer}>
        <Link to="/head/events/new-event" style={styles.link}>
          <button style={styles.button}>New Event</button>
        </Link>
        <Link to="/events/update-event" style={styles.link}>
          <button style={styles.button}>Manage Event</button>
        </Link>
        <Link to="/feedback" style={styles.link}>
          <button style={styles.button}>Add Feedback From</button>
        </Link>
        <Link to="/head/upload-photos" style={styles.link}>
          <button style={styles.button}>Update Gallery</button>
        </Link>
        <Link to="/attendance" style={styles.link}>
          <button style={styles.button}>Add Attendance</button>
        </Link>
        <Link to="/report" style={styles.link}>
          <button style={styles.button}>Generate Report</button>
        </Link>
      </div>
    </div>
  );
};

// Basic styling for the page and buttons
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none',
  }
};

export default EventPage;
