import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Your firebase configuration
import './ResponseForm.css'; // Import your CSS file for styling
import { doc, setDoc } from 'firebase/firestore';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS


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
<div className="response-form-container" style={{
  maxWidth: '500px', // Set a maximum width for the form
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
  fontFamily: 'Arial, sans-serif',
}}>
  <h2 style={{
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  }}>Response Form</h2>
  
  <form onSubmit={handleSubmit} style={{
    display: 'flex',
    flexDirection: 'column',
  }}>
    <div className="input-group" style={{ marginBottom: '15px' }}>
      <label htmlFor="event" style={{
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
      }}>Select Event:</label>
      
      <select
        id="event"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px',
        }}
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
      <div key={index} className="question-group" style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#555',
        }}>{question}</label>
        
        <div className="rating-slider-container" style={{
          position: 'relative',
          height: '30px',
        }}>
          <div
            className="filled"
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              height: '100%',
              backgroundColor: '#4caf50', // Green color for filled part
              transition: 'width 0.3s',
              width: responses[index] ? `${responses[index] * 20}%` : '0%', // 20% for each point (1-5)
              borderRadius: '4px 0 0 4px',
            }}
          />
          <input
            type="range"
            min="1"
            max="5"
            className="rating-slider"
            value={responses[index] || 1}
            onChange={(e) => handleInputChange(index, e.target.value)}
            style={{
              width: '100%',
              cursor: 'pointer',
              appearance: 'none',
              height: '5px',
              background: '#ddd',
              borderRadius: '5px',
              outline: 'none',
            }}
          />
        </div>
        <div className="rating-value" style={{
          textAlign: 'center',
          fontSize: '18px',
          color: '#333',
          marginTop: '5px',
        }}>{responses[index] || 1}</div>
      </div>
    ))}

    <button type="submit" className="submit-button" style={{
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      width: '100%', // Ensure the button is full width
      marginTop: '10px', // Add space above the button
    }}>Submit Responses</button>
  </form>
</div>

  );
};

export default ResponseForm;
