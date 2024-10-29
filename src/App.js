// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import Head from './components/Head';
import AddHead from './components/AddHead';
import AddVolunteer from './components/AddVolunteer';
import PhotoUpload from './components/PhotoUpload';
import Home from './components/Home'; // Import the new Home component
import Gallery from './components/Gallery1';
import EventPage from './components/Eventpage';
import NewEvent from './components/NewEvent';
import UpdateEvent from './components/UpdateEvent';
import EventsList from './components/EventsList';
import HeadList from './components/HeadList';
import VolunteerList from './components/VolunteerList';
import Landing from './components/Landing';
import About from './components/About';
import Contact from './components/Contact';
import Attendance from './components/AddAttendance';
import Profile from './components/Profile';
import FeedbackForm from './components/FeedbackForm';
import ResponseForm from './components/ResponseForm';
import FeedbackReport from './components/FeedbackReport';
import ReportsPage from './components/ReportsPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/head" element={<Head />} />
        <Route path="/admin/add-head" element={<AddHead />} /> 
        <Route path="/head/add-volunteer" element={<AddVolunteer />} /> 
        <Route path="/head/upload-photos" element={<PhotoUpload />} />
        <Route path="/home" element={<Home />} /> 
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/attendance" element={<Attendance />} /> 
        <Route path="/head/events/new-event" element={<NewEvent />} />
        <Route path="/events/update-event" element={<UpdateEvent />} />
        <Route path="/volunteers/events" element={<EventsList />} />
        <Route path="/head/head-list" element={<HeadList />} />
        <Route path="/head/manage-volunteers" element={<VolunteerList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/response" element={<ResponseForm />} />
        <Route path="/report" element={<FeedbackReport />} />
        <Route path="/report-page" element={<ReportsPage />} />

      </Routes>
    </Router>
  );
};

export default App;
