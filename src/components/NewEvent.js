import React, { useState } from 'react';
import { db } from '../firebase'; // Import Firestore db
import { collection, addDoc } from 'firebase/firestore';
import './NewEvent.css'; // Import the CSS file

const NewEvent = () => {
  const initialFormState = {
    name: '',
    description: '',
    hoursAlloted: '',
    date: '',
    reportingTime: '',
    rules: '',
    whatsappLink: '',
    limit: '', // Add limit field
  };

  const [eventData, setEventData] = useState(initialFormState);

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
      // Add event to Firestore
      const docRef = await addDoc(collection(db, 'events'), eventData);
      console.log('Event added with ID: ', docRef.id);
      alert('Event added successfully!');

      // Clear the form after submission
      setEventData(initialFormState);
    } catch (error) {
      console.error('Error adding event: ', error);
      alert('Failed to add event.');
    }
  };

  return (
    <div className="container">
      <h2>Create New Event</h2>
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
        <button type="submit" className="button">Submit</button>
      </form>
    </div>
  );
};

export default NewEvent;
