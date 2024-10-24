// src/components/VolunteerList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase'; // Ensure you have your Firebase configuration set up correctly
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './VolunteerList.css';

const firebase = getFirestore();
function VolunteerList() {
  const [volunteers, setVolunteers] = useState([]);
  const [editVolunteer, setEditVolunteer] = useState(null);
  const [newVolunteerData, setNewVolunteerData] = useState({
    pid: '',
    fullname: '',
    email: '',
    class: '',
    phoneno: ''
  });
  const [statusMessages, setStatusMessages] = useState([]); // Array to hold status messages

  // Fetch Volunteers from Firestore
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const volunteersCollection = collection(firebase, 'volunteers');
        const volunteerSnapshot = await getDocs(volunteersCollection);
        const volunteerList = volunteerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVolunteers(volunteerList);
      } catch (error) {
        console.error('Error fetching volunteers: ', error);
      }
    };

    fetchVolunteers();
  }, []);

  // Add all volunteers to Firebase Authentication
  const addAllVolunteers = async () => {
    const messages = []; // Local array to collect messages

    for (const volunteer of volunteers) {
      const { email, pid, fullname } = volunteer; // Use email and pid from the volunteer data

      try {
        // Create user in Firebase Authentication
        await createUserWithEmailAndPassword(auth, email, pid);
        messages.push(`Successfully added ${fullname}`); // Add success message
      } catch (error) {
        console.error('Error adding volunteer to auth: ', error);
        messages.push(`Error adding ${fullname}: ${error.message}`); // Add error message
      }
    }

    setStatusMessages(messages); // Update state with messages
  };

  // Update Volunteer in Firestore
  const handleUpdateVolunteer = async (id) => {
    const volunteerDoc = doc(firebase, 'volunteers', id);
    try {
      await updateDoc(volunteerDoc, newVolunteerData);
      const updatedVolunteerList = volunteers.map(vol => (vol.id === id ? { id, ...newVolunteerData } : vol));
      setVolunteers(updatedVolunteerList);
      setEditVolunteer(null);
    } catch (error) {
      console.error('Error updating volunteer: ', error);
    }
  };

  // Delete Volunteer from Firestore
  const handleDeleteVolunteer = async (id) => {
    const volunteerDoc = doc(firebase, 'volunteers', id);
    try {
      await deleteDoc(volunteerDoc);
      setVolunteers(volunteers.filter(vol => vol.id !== id));
    } catch (error) {
      console.error('Error deleting volunteer: ', error);
    }
  };

  // Set the form fields for editing a volunteer
  const handleEditClick = (volunteer) => {
    setEditVolunteer(volunteer);
    setNewVolunteerData(volunteer);
  };

  return (
    <div className="volunteer-list-container">
      <h3>Volunteers List</h3>
      <button className="btn btn-add-all" onClick={addAllVolunteers}>
        Add All Volunteers to Firebase Auth
      </button>
      <ul className="volunteer-list">
        {volunteers.map((volunteer) => (
          <li key={volunteer.id}>
            {editVolunteer && editVolunteer.id === volunteer.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  placeholder="PID"
                  value={newVolunteerData.pid}
                  onChange={(e) => setNewVolunteerData({ ...newVolunteerData, pid: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newVolunteerData.fullname}
                  onChange={(e) => setNewVolunteerData({ ...newVolunteerData, fullname: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newVolunteerData.email}
                  onChange={(e) => setNewVolunteerData({ ...newVolunteerData, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Class"
                  value={newVolunteerData.class}
                  onChange={(e) => setNewVolunteerData({ ...newVolunteerData, class: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone No"
                  value={newVolunteerData.phoneno}
                  onChange={(e) => setNewVolunteerData({ ...newVolunteerData, phoneno: e.target.value })}
                />
                <div className="button-group">
                  <button className="btn btn-save" onClick={() => handleUpdateVolunteer(volunteer.id)}>Save</button>
                  <button className="btn btn-cancel" onClick={() => setEditVolunteer(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <span>{volunteer.pid} - {volunteer.fullname} - {volunteer.email}</span>
                <div className="button-group">
                  <button className="btn btn-edit" onClick={() => handleEditClick(volunteer)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDeleteVolunteer(volunteer.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {/* Display Status Messages */}
      <div className="status-messages">
        {statusMessages.map((message, index) => (
          <p key={index} className="status-message">{message}</p>
        ))}
      </div>
    </div>
  );
}

export default VolunteerList;
