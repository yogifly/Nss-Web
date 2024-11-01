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
  const [registrations, setRegistrations] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [step, setStep] = useState(0); // Step state to control form navigation

  // Fetch events from Firestore
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

  // Function to handle selection change
  const handleSelectChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    const selectedEvent = events.find(event => event.id === eventId);
    setEventData(selectedEvent || {});
    setRegistrations(selectedEvent?.registrations || []);
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
      fetchEvents();
    } catch (error) {
      console.error('Error updating event: ', error);
      alert('Failed to update event.');
    }
  };

  // Define form steps
  const formSteps = [
    <>
      <label>
        Name:
        <input type="text" name="name" value={eventData.name} onChange={handleChange} required />
      </label>
      <label>
        Description:
        <textarea name="description" value={eventData.description} onChange={handleChange} required />
      </label>
    </>,
    <>
      <label>
        Hours Alloted:
        <input type="number" name="hoursAlloted" value={eventData.hoursAlloted} onChange={handleChange} required />
      </label>
      <label>
        Date:
        <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
      </label>
    </>,
    <>
      <label>
        Reporting Time:
        <input type="time" name="reportingTime" value={eventData.reportingTime} onChange={handleChange} required />
      </label>
      <label>
        Rules:
        <textarea name="rules" value={eventData.rules} onChange={handleChange} required />
      </label>
    </>,
    <>
      <label>
        WhatsApp Link:
        <input type="url" name="whatsappLink" value={eventData.whatsappLink} onChange={handleChange} required />
      </label>
      <label>
        Limit:
        <input type="number" name="limit" value={eventData.limit} onChange={handleChange} required />
      </label>
    </>
  ];

  // Navigation handlers
  const handleNext = () => setStep((prevStep) => Math.min(prevStep + 1, formSteps.length - 1));
  const handlePrev = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  return (
    <div className="container">
      <h2>Manage Event</h2>

      <div className="update-event-content">
        {/* Left Column: Update Event Form */}
        <div className="update-event-left">
          <label>
            Select Event:
            <select value={selectedEventId} onChange={handleSelectChange} required>
              <option value="" disabled>Select an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </label>

          <div className="section">
            <h3 className="collapsible-header" onClick={() => setShowUpdateForm(!showUpdateForm)}>
              Update Event {showUpdateForm ? '▲' : '▼'}
            </h3>
            {showUpdateForm && (
              <form className="form" onSubmit={handleSubmit}>
                {formSteps[step]} {/* Render the current step */}
                
                <div className="navigation-buttons">
                  {step > 0 && <button type="button" onClick={handlePrev}>Previous</button>}
                  {step < formSteps.length - 1 && <button type="button" onClick={handleNext}>Next</button>}
                  {step === formSteps.length - 1 && <button type="submit" className="button">Update</button>}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Registered Volunteers */}
        <div className="update-event-right">
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
                      <li key={index}>{volunteer.fullname}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No volunteers have registered for this event yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEvent;
