import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import './AddAttendance.css';

const AddAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEventName, setSelectedEventName] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [hoursAlloted, setHoursAlloted] = useState(0);
  const [markedAttendance, setMarkedAttendance] = useState([]);

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

  const handleSelectChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    
    const selectedEvent = events.find(event => event.id === eventId);
    if (selectedEvent) {
      setSelectedEventName(selectedEvent.name || '');
      setRegisteredUsers(selectedEvent.registrations || []);
      setHoursAlloted(parseInt(selectedEvent.hoursAlloted) || 0);

      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const eventData = eventSnap.data();
        setMarkedAttendance(eventData.markedAttendance || []);

        const initialAttendance = {};
        eventData.registrations.forEach((person) => {
          const markedUser = (eventData.markedAttendance || []).find(
            (attendee) => attendee.userid === person.userid
          );
          initialAttendance[person.userid] = markedUser
            ? markedUser.status === 'present'
            : false;
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

  const handleAttendanceChange = (userid) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [userid]: !prevAttendance[userid],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const markedAttendanceArray = [...markedAttendance];

    try {
      await Promise.all(
        registeredUsers.map(async (person) => {
          const isPresent = attendance[person.userid];
          const existingRecord = markedAttendanceArray.find(
            (record) => record.userid === person.userid
          );

          if (existingRecord) {
            existingRecord.status = isPresent ? 'present' : 'absent';
          } else {
            markedAttendanceArray.push({
              fullname: person.fullname,
              userid: person.userid,
              status: isPresent ? 'present' : 'absent',
            });
          }

          const personRefVolunteer = doc(db, 'volunteers', person.userid);
          const personRefHead = doc(db, 'heads', person.userid);

          // Update EventsRegistered and hoursRegistered for volunteer
          const personSnapVolunteer = await getDoc(personRefVolunteer);
          if (personSnapVolunteer.exists()) {
            const eventsRegisteredVolunteer = personSnapVolunteer.data().EventsRegistered || [];
            const currentHoursRegisteredVolunteer = personSnapVolunteer.data().hoursRegistered || 0;

            // Always add hoursAlloted to hoursRegistered
            if (eventsRegisteredVolunteer.some(event => event.eventName === selectedEventName)) {
              eventsRegisteredVolunteer.find(event => event.eventName === selectedEventName).status = isPresent ? 'present' : 'absent';
            } else {
              eventsRegisteredVolunteer.push({ eventName: selectedEventName, status: isPresent ? 'present' : 'absent' });
            }
            await updateDoc(personRefVolunteer, {
              EventsRegistered: eventsRegisteredVolunteer,
              hoursRegistered: currentHoursRegisteredVolunteer + hoursAlloted, // Always adding the hoursAlloted
            });
          }

          // Update EventsRegistered and hoursRegistered for head
          const personSnapHead = await getDoc(personRefHead);
          if (personSnapHead.exists()) {
            const eventsRegisteredHead = personSnapHead.data().EventsRegistered || [];
            const currentHoursRegisteredHead = personSnapHead.data().hoursRegistered || 0;

            // Always add hoursAlloted to hoursRegistered
            if (eventsRegisteredHead.some(event => event.eventName === selectedEventName)) {
              eventsRegisteredHead.find(event => event.eventName === selectedEventName).status = isPresent ? 'present' : 'absent';
            } else {
              eventsRegisteredHead.push({ eventName: selectedEventName, status: isPresent ? 'present' : 'absent' });
            }
            await updateDoc(personRefHead, {
              EventsRegistered: eventsRegisteredHead,
              hoursRegistered: currentHoursRegisteredHead + hoursAlloted, // Always adding the hoursAlloted
            });
          }
        })
      );

      const eventRef = doc(db, 'events', selectedEventId);
      await updateDoc(eventRef, {
        markedAttendance: markedAttendanceArray
      });

      alert('Attendance marked successfully! Hours and attendance status have been updated.');
      setSelectedEventId('');
      setSelectedEventName('');
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
