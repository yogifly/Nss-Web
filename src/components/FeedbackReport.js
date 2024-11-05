// src/FeedbackReport.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './FeedbackReport.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const FeedbackReport = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
    setShowCharts(false);
    setFeedbackData([]);
    setErrorMessage('');
  };

  const handleGenerateFeedback = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Get feedback data
      const feedbackCollection = collection(db, 'events', selectedEvent, 'feedback');
      const feedbackSnapshot = await getDocs(feedbackCollection);

      if (!feedbackSnapshot.empty) {
        const feedbackList = feedbackSnapshot.docs.map(doc => doc.data());
        setFeedbackData(feedbackList);
        setShowCharts(true);

        // Get event name
        const eventDoc = await getDoc(doc(db, 'events', selectedEvent));
        const eventName = eventDoc.exists() ? eventDoc.data().name : 'Unknown Event';

        // Save the feedback report to the 'reports' collection with event name
        await addDoc(collection(db, 'reports'), {
          eventId: selectedEvent,
          eventName: eventName,
          feedbackData: feedbackList,
          timestamp: new Date()
        });
      } else {
        setErrorMessage('No feedback form for this event.');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setErrorMessage('Failed to fetch feedback.');
    }
    setLoading(false);
  };

  const getBarChartData = (questionIndex) => {
    const questionFeedback = feedbackData.map(feedback => feedback.answers);
    const counts = {};

    questionFeedback.forEach(feedback => {
      Object.values(feedback).forEach(answerArray => {
        const answer = answerArray[questionIndex];
        counts[answer] = (counts[answer] || 0) + 1;
      });
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Responses',
          data: Object.values(counts),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getOverallSentimentCounts = () => {
    const sentimentCounts = { worst: 0, neutral: 0, good: 0 };

    feedbackData.forEach(feedback => {
      Object.values(feedback.answers).forEach(answerObj => {
        if (typeof answerObj === 'object' && answerObj !== null) {
          Object.values(answerObj).forEach(answer => {
            if (answer === 1) {
              sentimentCounts.worst += 1;
            } else if (answer === 2 || answer === 3) {
              sentimentCounts.neutral += 1;
            } else if (answer === 4 || answer === 5) {
              sentimentCounts.good += 1;
            }
          });
        }
      });
    });

    return sentimentCounts;
  };

  const getPieChartData = () => {
    const sentimentCounts = getOverallSentimentCounts();

    return {
      labels: ['Worst', 'Neutral', 'Good'],
      datasets: [
        {
          label: 'Overall Sentiment',
          data: [sentimentCounts.worst, sentimentCounts.neutral, sentimentCounts.good],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="feedback-report-container">
    <h2 className="feedback-report-title">Feedback Report</h2>
    <label htmlFor="event-select" className="feedback-report-label">Select an Event:</label>
    <select
      id="event-select"
      value={selectedEvent}
      onChange={(e) => handleEventSelect(e.target.value)}
      className="feedback-report-dropdown"
    >
      <option value="">-- Select an Event --</option>
      {events.map((event) => (
        <option key={event.id} value={event.id}>{event.name}</option>
      ))}
    </select>

    {selectedEvent && (
      <button onClick={handleGenerateFeedback} className="feedback-report-generate-btn">
        Generate Feedback
      </button>
    )}

    {loading && <p className="feedback-report-loading">Loading feedback...</p>}
    {errorMessage && <p className="feedback-report-error">{errorMessage}</p>}

    {showCharts && feedbackData.length > 0 && (
      <div className="feedback-report-display">
        <h3 className="feedback-report-subtitle">Feedback for Selected Event</h3>
        
        <div className="feedback-report-chart-columns">
          <div className="feedback-report-bar-charts">
            {feedbackData[0].questions.map((question, qIndex) => (
              <div key={qIndex} className="feedback-report-question-answer">
                <p><strong>Q{qIndex + 1}: {question}</strong></p>
                <div className="feedback-report-chart-container">
                  <Bar data={getBarChartData(qIndex)} options={{ responsive: true, plugins: { legend: { position: 'top' } }}} />
                </div>
              </div>
            ))}
          </div>

          <div className="feedback-report-pie-chart">
            <h3 className="feedback-report-sentiment-title">Overall Sentiment Analysis</h3>
            <Pie data={getPieChartData()} options={{ responsive: true, plugins: { legend: { position: 'top' } }}} />
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default FeedbackReport;
