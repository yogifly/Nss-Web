import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore db
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './UpdateEvent.css'; // Import the CSS file

const UpdateEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    hoursAlloted: '',
    date: '',
    reportingTime: '',
    rules: '',
    whatsappLink: '',
    limit: '',
  });
  const [registrations, setRegistrations] = useState([]); // State to store registered volunteers
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Toggle for update section
  const [showVolunteers, setShowVolunteers] = useState(false); // Toggle for volunteers section

  // Fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched events:', eventList); // Log the fetched events
      setEvents(eventList);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to handle selection change
  const handleSelectChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    const selectedEvent = events.find(event => event.id === eventId);
    console.log('Selected Event:', selectedEvent); // Log the selected event

    // Set event data
    setEventData(selectedEvent || {});

    // Check if 'registrations' exist and set them
    if (selectedEvent && selectedEvent.registrations) {
      setRegistrations(selectedEvent.registrations); // Assuming registrations is an array of objects
      console.log('Registered Volunteers:', selectedEvent.registrations); // Log registered volunteers
    } else {
      setRegistrations([]);
      console.log('No volunteers registered for this event.');
    }
  };

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventRef = doc(db, 'events', selectedEventId);
      await updateDoc(eventRef, eventData);
      alert('Event updated successfully!');
      setEventData({
        name: '',
        description: '',
        hoursAlloted: '',
        date: '',
        reportingTime: '',
        rules: '',
        whatsappLink: '',
        limit: '',
      });
      setSelectedEventId('');
      fetchEvents(); // Refresh the event list
    } catch (error) {
      console.error('Error updating event: ', error);
      alert('Failed to update event.');
    }
  };

  return (
    <div className="container">
      <h2>Manage Event</h2>

      {/* Select Event */}
      <label>
        Select Event:
        <select value={selectedEventId} onChange={handleSelectChange} required>
          <option value="" disabled>Select an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </label>

      {/* Section 1: Update Event Form */}
      <div className="section">
        <h3 className="collapsible-header" onClick={() => setShowUpdateForm(!showUpdateForm)}>
          Update Event {showUpdateForm ? '▲' : '▼'}
        </h3>
        {showUpdateForm && (
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={eventData.name} onChange={handleChange} required />
            </label>
            <label>
              Description:
              <textarea name="description" value={eventData.description} onChange={handleChange} required />
            </label>
            <label>
              Hours Alloted:
              <input type="number" name="hoursAlloted" value={eventData.hoursAlloted} onChange={handleChange} required />
            </label>
            <label>
              Date:
              <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
            </label>
            <label>
              Reporting Time:
              <input type="time" name="reportingTime" value={eventData.reportingTime} onChange={handleChange} required />
            </label>
            <label>
              Rules:
              <textarea name="rules" value={eventData.rules} onChange={handleChange} required />
            </label>
            <label>
              WhatsApp Link:
              <input type="url" name="whatsappLink" value={eventData.whatsappLink} onChange={handleChange} required />
            </label>
            <label>
              Limit:
              <input type="number" name="limit" value={eventData.limit} onChange={handleChange} required />
            </label>
            <button type="submit" className="button">Update</button>
          </form>
        )}
      </div>

      {/* Section 2: Registered Volunteers */}
      <div className="section">
        <h3 className="collapsible-header" onClick={() => setShowVolunteers(!showVolunteers)}>
          Registered Volunteers {showVolunteers ? '▲' : '▼'}
        </h3>
        {showVolunteers && (
          <div className="registrations-list">
            <h3>Registered Volunteers</h3>
            {registrations.length > 0 ? (
              <ul>
                {registrations.map((volunteer, index) => (
                  <li key={index}>{volunteer.fullname}</li> // Displaying the full name of registered volunteers
                ))}
              </ul>
            ) : (
              <p>No volunteers have registered for this event yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateEvent;
