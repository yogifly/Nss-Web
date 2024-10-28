import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Your firebase configuration
import './ResponseForm.css'; // Import your CSS file for styling

const ResponseForm = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventDocs = await getDocs(eventsCollection);
      const eventList = eventDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedEvent) {
        const feedbackRef = collection(db, 'events', selectedEvent, 'feedback');
        const feedbackQuery = query(feedbackRef);
        const feedbackDocs = await getDocs(feedbackQuery);
        
        const questionsList = feedbackDocs.docs.map(doc => doc.data().questions).flat();
        setQuestions(questionsList);
        // Reset responses when the event changes
        setResponses({});
      }
    };

    fetchQuestions();
  }, [selectedEvent]);

  const handleInputChange = (index, value) => {
    setResponses({
      ...responses,
      [index]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions have been answered
    if (selectedEvent && Object.keys(responses).length === questions.length) {
      try {
        const responseRef = collection(db, 'events', selectedEvent, 'feedback', 'responses');
        await addDoc(responseRef, { responses });
        alert('Responses submitted successfully!');
        
        // Reset the form after successful submission
        setResponses({});
        setSelectedEvent(''); // Reset selected event
      } catch (error) {
        console.error('Error submitting responses:', error);
        alert('Failed to submit responses. Please try again.');
      }
    } else {
      alert('Please complete all questions before submitting.');
    }
  };

  return (
    <div className="response-form-container">
      <h2>Response Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="event">Select Event:</label>
          <select
            id="event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
          >
            <option value="">--Select an Event--</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} {/* Assuming the event has a 'name' field */}
              </option>
            ))}
          </select>
        </div>

        {questions.length > 0 && questions.map((question, index) => (
          <div key={index} className="question-group">
            <label>{question}</label>
            <div className="rating-slider-container">
              <div
                className="filled"
                style={{
                  width: responses[index] ? `${responses[index] * 20}%` : '0%', // 20% for each point (1-5)
                }}
              />
              <input
                type="range"
                min="1"
                max="5"
                className="rating-slider"
                value={responses[index] || 1}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{ cursor: 'pointer' }} // Added cursor style for better UX
              />
            </div>
            <div className="rating-value">{responses[index] || 1}</div>
          </div>
        ))}

        <button type="submit" className="submit-button">Submit Responses</button>
      </form>
    </div>
  );
};

export default ResponseForm;
