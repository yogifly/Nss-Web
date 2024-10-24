import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore db
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import './AddAttendance.css'; // Import the CSS file

const AddAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [hoursAlloted, setHoursAlloted] = useState(0);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to handle event selection
  const handleSelectChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    
    // Fetch selected event details
    const selectedEvent = events.find(event => event.id === eventId);
    if (selectedEvent) {
      if (selectedEvent.registrations) {
        setRegisteredUsers(selectedEvent.registrations);
      }
      setHoursAlloted(parseInt(selectedEvent.hoursAlloted) || 0);
      
      const initialAttendance = {};
      selectedEvent.registrations.forEach(person => {
        initialAttendance[person.userid] = false; // Default attendance to false (absent)
      });
      setAttendance(initialAttendance);
    } else {
      setRegisteredUsers([]);
      setHoursAlloted(0);
      setAttendance({});
    }
  };

  // Function to handle attendance checkbox change
  const handleAttendanceChange = (userid) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [userid]: !prevAttendance[userid], // Toggle attendance
    }));
  };

  // Function to submit attendance and update hoursRegistered for both volunteers and heads
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        registeredUsers.map(async (person) => {
          if (attendance[person.userid]) {
            // Update hours for both volunteers and heads
            const personRefVolunteer = doc(db, 'volunteers', person.userid); // Assuming volunteers are in 'volunteers' collection
            const personRefHead = doc(db, 'heads', person.userid); // Assuming heads are in 'heads' collection
            
            // Check if the person is in the 'volunteers' collection
            const personSnapVolunteer = await getDoc(personRefVolunteer);
            if (personSnapVolunteer.exists()) {
              const currentHours = parseInt(personSnapVolunteer.data().hoursRegistered) || 0;
              const newHours = currentHours + hoursAlloted;

              // Update the volunteer's hoursRegistered
              await updateDoc(personRefVolunteer, {
                hoursRegistered: newHours
              });
            }

            // Check if the person is in the 'heads' collection
            const personSnapHead = await getDoc(personRefHead);
            if (personSnapHead.exists()) {
              const currentHours = parseInt(personSnapHead.data().hoursRegistered) || 0;
              const newHours = currentHours + hoursAlloted;

              // Update the head's hoursRegistered
              await updateDoc(personRefHead, {
                hoursRegistered: newHours
              });
            }
          }
        })
      );

      alert('Attendance marked successfully! Hours have been updated for both volunteers and heads.');
      // Reset the form
      setSelectedEventId('');
      setRegisteredUsers([]);
      setAttendance({});
      setHoursAlloted(0);
    } catch (error) {
      console.error('Error marking attendance: ', error);
      alert('Failed to mark attendance.');
    }
  };

  return (
    <div className="attendance-container">
      <h2>Add Attendance</h2>

      <label>
        Select Event:
        <select value={selectedEventId} onChange={handleSelectChange} required>
          <option value="" disabled>Select an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </label>

      {registeredUsers.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <h3>Mark Attendance for Registered Users</h3>
          {registeredUsers.map((person) => (
            <div key={person.userid} className="volunteer-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={attendance[person.userid] || false}
                  onChange={() => handleAttendanceChange(person.userid)}
                />
                {person.fullname}
              </label>
            </div>
          ))}
          <button type="submit" className="submit-button">Submit Attendance</button>
        </form>
      ) : null}
    </div>
  );
};

export default AddAttendance;
