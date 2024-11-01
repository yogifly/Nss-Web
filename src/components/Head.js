import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AddVolunteer from './AddVolunteer';
import NewEvent from './NewEvent';
import './Head.css'; // Add a new CSS file for Main component styling
import UpdateEvent from './UpdateEvent';
import FeedbackForm from './FeedbackForm';
import AddAttendance from './AddAttendance';
import Profile from './Profile';
import FeedbackReport from './FeedbackReport';
import ResponseForm from './ResponseForm';
import ReportsPage from './ReportsPage';
import PhotoUpload from './PhotoUpload';
import Main from './Main';

const Head = () => {
    const [activeTab, setActiveTab] = useState(''); // Set initial state

    return (
        <div className="app-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="main-content">
            {activeTab === '' && <Main />}
                {activeTab === 'statistics' && <AddVolunteer />}
                {/* Add other components based on activeTab values */}
                {activeTab === 'newEvent' && <NewEvent />}
                {activeTab === 'manageEvent' && <UpdateEvent/>}
                {activeTab === 'addFeedback' && <FeedbackForm/>}
                {activeTab === 'addAttendance' && <AddAttendance/>}
                {activeTab === 'feedback' && <ResponseForm/>}
                {activeTab === 'analysis' && <ReportsPage/>}
                {activeTab === 'profile' && <Profile/>}
                {activeTab === 'photo' && <PhotoUpload/>}
            </main>
        </div>
        
    );
};

export default Head;
