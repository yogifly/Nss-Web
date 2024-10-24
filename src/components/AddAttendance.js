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
  const [markedAttendance, setMarkedAttendance] = useState([]);

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

      // Fetch marked attendance for this event
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const eventData = eventSnap.data();
        setMarkedAttendance(eventData.markedAttendance || []);

        const initialAttendance = {};
        eventData.registrations.forEach((person) => {
          // Pre-fill attendance based on markedAttendance
          const markedUser = (eventData.markedAttendance || []).find(
            (attendee) => attendee.userid === person.userid
          );
          initialAttendance[person.userid] = markedUser
            ? markedUser.status === 'present'
            : false; // Default to false if not present in markedAttendance
        });
        setAttendance(initialAttendance);
      }
    } else {
      setRegisteredUsers([]);
      setHoursAlloted(0);
      setAttendance({});
      setMarkedAttendance([]);
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
    const markedAttendanceArray = [...markedAttendance]; // Start with current markedAttendance

    try {
      await Promise.all(
        registeredUsers.map(async (person) => {
          const isPresent = attendance[person.userid];

          // Check if the user is already marked
          const existingRecord = markedAttendanceArray.find(
            (record) => record.userid === person.userid
          );

          // Update markedAttendance array
          if (existingRecord) {
            existingRecord.status = isPresent ? 'present' : 'absent';
          } else {
            markedAttendanceArray.push({
              fullname: person.fullname,
              userid: person.userid,
              status: isPresent ? 'present' : 'absent',
            });
          }

          // Update hours only if the user is marked as present for the first time
          if (isPresent && (!existingRecord || existingRecord.status !== 'present')) {
            const personRefVolunteer = doc(db, 'volunteers', person.userid);
            const personRefHead = doc(db, 'heads', person.userid);
            
            // Check and update volunteer's hoursRegistered
            const personSnapVolunteer = await getDoc(personRefVolunteer);
            if (personSnapVolunteer.exists()) {
              const currentHours = parseInt(personSnapVolunteer.data().hoursRegistered) || 0;
              const newHours = currentHours + hoursAlloted;
              await updateDoc(personRefVolunteer, {
                hoursRegistered: newHours
              });
            }

            // Check and update head's hoursRegistered
            const personSnapHead = await getDoc(personRefHead);
            if (personSnapHead.exists()) {
              const currentHours = parseInt(personSnapHead.data().hoursRegistered) || 0;
              const newHours = currentHours + hoursAlloted;
              await updateDoc(personRefHead, {
                hoursRegistered: newHours
              });
            }
          }
        })
      );

      // Save the updated markedAttendance array to Firestore
      const eventRef = doc(db, 'events', selectedEventId);
      await updateDoc(eventRef, {
        markedAttendance: markedAttendanceArray // Update the markedAttendance array
      });

      alert('Attendance marked successfully! Hours and attendance status have been updated.');
      // Reset the form
      setSelectedEventId('');
      setRegisteredUsers([]);
      setAttendance({});
      setHoursAlloted(0);
      setMarkedAttendance([]);
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
