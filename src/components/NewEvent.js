import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './NewEvent.css';

const NewEvent = () => {
  const initialFormState = {
    name: '',
    description: '',
    hoursAlloted: '',
    date: '',
    reportingTime: '',
    rules: '',
    whatsappLink: '',
    limit: '',
  };

  const [eventData, setEventData] = useState(initialFormState);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    ['name', 'description'],
    ['date', 'reportingTime'],
    ['hoursAlloted', 'rules'],
    ['whatsappLink', 'limit']
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'events'), eventData);
      console.log('Event added with ID: ', docRef.id);
      alert('Event added successfully!');
      setEventData(initialFormState);
      setCurrentStep(0); // Reset to the first step
    } catch (error) {
      console.error('Error adding event: ', error);
      alert('Failed to add event.');
    }
  };

  return (
    <div className="ne-container">
      <h2 className="ne-header">Create New Event</h2>
      <form className="ne-form" onSubmit={handleSubmit}>
        {steps[currentStep].map((field) => (
          <div key={field} className="ne-form-group">
            <label className="ne-label">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            {field === 'description' || field === 'rules' ? (
              <textarea
                className="ne-textarea"
                name={field}
                value={eventData[field]}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                className="ne-input"
                type={field === 'date' ? 'date' : field === 'reportingTime' ? 'time' : 'text'}
                name={field}
                value={eventData[field]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <div className="ne-button-group">
  <button 
    type="button" 
    onClick={handlePrev} 
    disabled={currentStep === 0} 
    className="ne-button ne-prev-button"
  >
    Previous
  </button>
  {currentStep < steps.length - 1 ? (
    <button 
      type="button" 
      onClick={handleNext} 
      className="ne-button"
    >
      Next
    </button>
  ) : (
    <button 
      type="submit" 
      className="ne-button"
    >
      Submit
    </button>
  )}
</div>

      </form>
    </div>
  );
};

export default NewEvent;
