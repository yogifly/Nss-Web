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
    <div className="manage-event-container">
      <h2 className="manage-event-title">Manage Event</h2>
  
      {/* Select Event */}
      <label className="manage-event-label">
        Select Event:
        <select
          className="manage-event-select"
          value={selectedEventId}
          onChange={handleSelectChange}
          required
        >
          <option value="" disabled>Select an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </label>
  
      {/* Section 1: Update Event Form */}
      <div className="manage-event-section">
        <h3
          className="manage-event-collapsible-header"
          onClick={() => setShowUpdateForm(!showUpdateForm)}
        >
          Update Event {showUpdateForm ? '▲' : '▼'}
        </h3>
        {showUpdateForm && (
          <form className="manage-event-form" onSubmit={handleSubmit}>
            <label className="manage-event-form-label">
              Name:
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                required
                className="manage-event-input"
              />
            </label>
            <label className="manage-event-form-label">
              Description:
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
                required
                className="manage-event-textarea"
              />
            </label>
            <label className="manage-event-form-label">
              Hours Alloted:
              <input
                type="number"
                name="hoursAlloted"
                value={eventData.hoursAlloted}
                onChange={handleChange}
                required
                className="manage-event-input"
              />
            </label>
            <label className="manage-event-form-label">
              Date:
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                required
                className="manage-event-input"
              />
            </label>
            <label className="manage-event-form-label">
              Reporting Time:
              <input
                type="time"
                name="reportingTime"
                value={eventData.reportingTime}
                onChange={handleChange}
                required
                className="manage-event-input"
              />
            </label>
            <label className="manage-event-form-label">
              Rules:
              <textarea
                name="rules"
                value={eventData.rules}
                onChange={handleChange}
                required
                className="manage-event-textarea"
              />
            </label>
            <label className="manage-event-form-label">
              WhatsApp Link:
              <input
                type="url"
                name="whatsappLink"
                value={eventData.whatsappLink}
                onChange={handleChange}
                required
                className="manage-event-input"
              />
            </label>
            <label className="manage-event-form-label">
              Limit:
              <input
                type="number"
                name="limit"
                value={eventData.limit}
                onChange={handleChange}
                required
                className="manage-event-input"
              />
            </label>
            <button type="submit" className="manage-event-button">Update</button>
          </form>
        )}
      </div>
  
      {/* Section 2: Registered Volunteers */}
      <div className="manage-event-section">
        <h3
          className="manage-event-collapsible-header"
          onClick={() => setShowVolunteers(!showVolunteers)}
        >
          Registered Volunteers {showVolunteers ? '▲' : '▼'}
        </h3>
        {showVolunteers && (
          <div className="manage-event-registrations-list">
            <h3 className="manage-event-volunteers-title">Registered Volunteers</h3>
            {registrations.length > 0 ? (
              <ul className="manage-event-volunteers-list">
                {registrations.map((volunteer, index) => (
                  <li key={index} className="manage-event-volunteer-item">
                    {volunteer.fullname}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="manage-event-no-volunteers">No volunteers have registered for this event yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};  

export default UpdateEvent;
