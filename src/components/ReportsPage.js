import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import './ReportsPage.css'; // Import the CSS file

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      const reportsCollection = collection(db, 'reports');
      const reportsSnapshot = await getDocs(reportsCollection);
      const reportsList = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(reportsList);

      const uniqueEventNames = Array.from(new Set(reportsList.map(report => report.eventName)));
      setEventNames(uniqueEventNames);
    };

    fetchReports();
  }, []);

  const filteredReports = selectedEvent 
    ? reports.filter(report => report.eventName === selectedEvent) 
    : [];


  const getBarChartData = (feedbackData, questionIndex) => {
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

  const getPieChartData = (feedbackData) => {
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

  const downloadReportAsImage = async () => {
    const element = document.querySelector('.nss-report-container');
    if (element) {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      saveAs(dataUrl, 'report.png');
    }
  };

  return (
    <div className="nss-report-container">
      <h2 className="nss-report-header">Saved Reports</h2>
  
      <div className="nss-report-columns">
        {/* Left Column: Event Selection and Pie Chart */}
        <div className="nss-left-column">
          {/* Event Selection Dropdown */}
          <div className="nss-select-event">
            <select
              className="nss-event-dropdown"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="">Select an Event</option>
              {eventNames.map((eventName, index) => (
                <option key={index} value={eventName}>
                  {eventName}
                </option>
              ))}
            </select>
          </div>
  
          {filteredReports.length === 0 ? (
            <p className="nss-no-reports">No reports available for this event.</p>
          ) : (
            <div className="nss-pie-chart-container">
              <h3 className="nss-pie-chart-title">Overall Sentiment Analysis</h3>
              <Pie
                data={getPieChartData(filteredReports[0].feedbackData)}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' } },
                }}
              />
            </div>
          )}
  
          {/* Download Button */}
          <button className="nss-download-button" onClick={downloadReportAsImage}>
            Download Report as Image
          </button>
        </div>
  
        {/* Right Column: Bar Charts */}
        <div className="nss-right-column">
          {filteredReports.length > 0 && (
            filteredReports[0].feedbackData[0].questions.map((question, qIndex) => (
              <div key={qIndex} className="nss-question">
                <p className="nss-question-text">
                  Q{qIndex + 1}: {question}
                </p>
                <div className="nss-bar-chart">
                  <Bar
                    data={getBarChartData(filteredReports[0].feedbackData, qIndex)}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'top' } },
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;