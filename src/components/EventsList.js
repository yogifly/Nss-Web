import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import Firestore db
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import necessary Firestore functions
import './EventsList.css'; // Import CSS file

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullname, setFullname] = useState(''); // Set this from user authentication or input
  const [userid, setUserId] = useState(''); // User ID state
  const [userRole, setUserRole] = useState(''); // User role state

  // Fetch events from Firestore
  const fetchEvents = async () => {
    const eventsCollection = collection(db, 'events');
    const eventSnapshot = await getDocs(eventsCollection);
    const eventList = eventSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(eventList);
  };

  useEffect(() => {
    // Fetch the events once the component mounts
    fetchEvents();

    // Retrieve fullname, userid, and userRole from localStorage
    const storedFullname = localStorage.getItem('fullname');
    const storedUserId = localStorage.getItem('userid');
    const storedUserRole = localStorage.getItem('userType');
    
    if (storedFullname && storedUserId && storedUserRole) {
      setFullname(storedFullname);
      setUserId(storedUserId);
      setUserRole(storedUserRole);
    } else {
      alert('Please login to register for events.');
    }
  }, []);

  // Function to handle event selection
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Function to handle registration
  const handleRegister = async () => {
    if (fullname && userid) {
      // Check if the selected event has a limit on registrations
      const registrations = selectedEvent.registrations || [];
      const currentRegistrationsCount = registrations.length;
      const registrationLimit = selectedEvent.limit || 0; // Default to 0 if limit is not set

      if (currentRegistrationsCount >= registrationLimit) {
        alert('Registration slots are full for this event.');
        return;
      }

      try {
        // Get the document reference of the selected event
        const eventDocRef = doc(db, 'events', selectedEvent.id);

        // Create registration data with fullname and userid
        const registrationData = {
          fullname: fullname,
          userid: userid
        };

        // Update the event document to include the registration details
        await updateDoc(eventDocRef, {
          registrations: arrayUnion(registrationData) // Use arrayUnion to add the registration object to the "registrations" array
        });

        // Determine collection based on userRole
        const userCollection = userRole === 'head' ? 'heads' : 'volunteers';
        const userDocRef = doc(db, userCollection, userid);

        const eventRegistrationData = {
          eventname: selectedEvent.name,
          status: null // Initialize status as null
        };

        // Add the event name and status to the EventsRegistered array in the user's document
        await updateDoc(userDocRef, {
          EventsRegistered: arrayUnion(eventRegistrationData) // Use arrayUnion to add the event registration to the array
        });

        alert(`Successfully registered ${fullname} for the event: ${selectedEvent.name}`);
        setSelectedEvent(null); // Clear the selected event after registration
      } catch (error) {
        console.error('Error registering for event: ', error);
        alert('There was an error registering for the event. Please try again.');
      }
    } else {
      alert('Please ensure you are logged in to register for the event.');
    }
  };

  return (
    <div className="container">
      <h2>Upcoming Events</h2>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="event-details">
          <h3>{selectedEvent.name}</h3>
          <p><strong>Description:</strong> {selectedEvent.description}</p>
          <p><strong>Hours Allotted:</strong> {selectedEvent.hoursAlloted}</p>
          <p><strong>Date:</strong> {selectedEvent.date}</p>
          <p><strong>Reporting Time:</strong> {selectedEvent.reportingTime}</p>
          <p><strong>Rules:</strong> {selectedEvent.rules}</p>
          <p><strong>WhatsApp Link:</strong> <a href={selectedEvent.whatsappLink} target="_blank" rel="noopener noreferrer">{selectedEvent.whatsappLink}</a></p>
          <p><strong>Limit:</strong> {selectedEvent.limit}</p>
          <p><strong>Current Registrations:</strong> {selectedEvent.registrations?.length || 0}</p> {/* Show the current registrations */}

          <button onClick={handleRegister} className="button">Register for Event</button>
        </div>
      )}
    </div>
  );
};

export default EventsList;
