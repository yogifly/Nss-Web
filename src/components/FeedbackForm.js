import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Your firebase configuration
import './FeedbackForm.css'; // Import your CSS file for styling

const FeedbackForm = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [feedbackQuestions, setFeedbackQuestions] = useState([{ question: '' }]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventDocs = await getDocs(eventsCollection);
      const eventList = eventDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  const handleAddQuestion = () => {
    setFeedbackQuestions([...feedbackQuestions, { question: '' }]);
  };

  const handleInputChange = (index, value) => {
    const updatedQuestions = [...feedbackQuestions];
    updatedQuestions[index].question = value;
    setFeedbackQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedEvent) {
      try {
        const feedbackRef = collection(db, 'events', selectedEvent, 'feedback');
        await addDoc(feedbackRef, { questions: feedbackQuestions.map(q => q.question) });
        alert('Feedback questions submitted successfully!');
        // Optionally, reset the form
        setFeedbackQuestions([{ question: '' }]);
      } catch (error) {
        console.error('Error submitting feedback questions:', error);
        alert('Failed to submit feedback questions. Please try again.');
      }
    } else {
      alert('Please select an event to submit feedback questions.');
    }
  };

  return (
    <div className="feedback-form-container">
      <h2 className="feedback-form-title">Feedback Form</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="feedback-input-group">
          <label htmlFor="event" className="feedback-label">Select Event:</label>
          <select
            id="event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
            className="feedback-select"
          >
            <option value="">--Select an Event--</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} {/* Assuming the event has a 'name' field */}
              </option>
            ))}
          </select>
        </div>
  
        {feedbackQuestions.map((question, index) => (
          <div key={index} className="feedback-question-group">
            <input
              type="text"
              placeholder="Enter your question"
              value={question.question}
              onChange={(e) => handleInputChange(index, e.target.value)}
              required
              className="feedback-question-input"
            />
          </div>
        ))}
  
        <button type="button" onClick={handleAddQuestion} className="feedback-add-question-button">
          +
        </button>
  
        <button type="submit" className="feedback-submit-button">Submit Feedback Form</button>
      </form>
    </div>
  );
};
export default FeedbackForm;
