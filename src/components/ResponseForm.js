import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Your firebase configuration
import './ResponseForm.css'; // Import your CSS file for styling
import { doc, setDoc } from 'firebase/firestore';

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
  
    // Prompt the user to enter their name for `feedbackId`
    const fullname = localStorage.getItem('fullname'); // Assuming 'userName' is the key used to store the name
  if (!fullname) {
    alert("Name is required to submit responses.");
    return;
  }
  
    // Validate responses
    if (selectedEvent && Object.keys(responses).length === questions.length) {
      try {
        const feedbackRef = collection(db, 'events', selectedEvent, 'feedback');
        const feedbackQuerySnapshot = await getDocs(feedbackRef);
  
        // Loop through feedback documents to find the specific feedback ID
        let feedbackId = null;
        feedbackQuerySnapshot.forEach((doc) => {
          const feedbackData = doc.data();
          if (feedbackData && feedbackData.questions) {
            feedbackId = doc.id; // assuming one feedback document per event
          }
        });
  
        if (!feedbackId) {
          alert("Feedback not found for the selected event.");
          return;
        }
  
        // Create answers object with question index as keys
        const answers = {};
        Object.keys(responses).forEach(index => {
          answers[index] = parseInt(responses[index]);
        });
  
        // Update or create document with user's name as feedback ID
        const userFeedbackRef = doc(db, 'events', selectedEvent, 'feedback', feedbackId);
        await setDoc(
          userFeedbackRef,
          { answers: { [fullname]: answers } },
          { merge: true }
        );
  
        alert("Responses submitted successfully!");
  
        // Reset form after successful submission
        setResponses({});
        setSelectedEvent('');
      } catch (error) {
        console.error("Error submitting responses:", error);
        alert("Failed to submit responses. Please try again.");
      }
    } else {
      alert("Please complete all questions before submitting.");
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
