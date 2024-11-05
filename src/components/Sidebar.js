import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import at the top
import './Sidebar.css';
import { FaChartLine, FaList, FaClipboardList, FaUserCircle, FaCog, FaCaretDown } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isEventManagementOpen, setEventManagementOpen] = useState(false);
    const [fullname, setFullname] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve fullname from localStorage
        const storedFullname = localStorage.getItem('fullname');
        if (storedFullname) {
            setFullname(storedFullname);
        }
    }, []);

    const handleToggleEventManagement = () => {
        setEventManagementOpen(!isEventManagementOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('fullname');
        localStorage.removeItem('userid');
        navigate('/login');
    };

    return (
        <aside className="admin-sidebar">
            {/* Display fullname at the top of the sidebar */}
            <div className="sidebar-header">
                <FaUserCircle className="user-icon" />
                <span className="user-name">{fullname}</span>
            </div>
            <ul className="sidebar-menu">
                <li onClick={() => setActiveTab('statistics')} className={activeTab === 'statistics' ? 'active' : ''}>
                    <FaChartLine className="icon" />
                    <span>Add Volunteer</span>
                </li>
                <li onClick={() => setActiveTab('head/manage-volunteers')} className={activeTab === 'head/manage-volunteers' ? 'active' : ''}>
                    <FaChartLine className="icon" />
                    <span>Manage Volunteer</span>
                </li>
                <li onClick={() => setActiveTab('volunteers/events')} className={activeTab === 'volunteers/events' ? 'active' : ''}>
                    <FaChartLine className="icon" />
                    <span>Register For Event</span>
                </li>
                <li className={`event-management ${isEventManagementOpen ? 'active' : ''}`}>
                    <div onClick={handleToggleEventManagement} className="menu-item">
                        <FaList className="icon" />
                        <span>Events Management</span>
                        <FaCaretDown className={`caret ${isEventManagementOpen ? 'open' : ''}`} />
                    </div>
                    {isEventManagementOpen && (
                        <ul className="sub-menu">
                            <li onClick={() => setActiveTab('newEvent')} className={activeTab === 'newEvent' ? 'active' : ''}>
                                <span>New Event</span>
                            </li>
                            <li onClick={() => setActiveTab('manageEvent')} className={activeTab === 'manageEvent' ? 'active' : ''}>
                                <span>Manage Event</span>
                            </li>
                            <li onClick={() => setActiveTab('addFeedback')} className={activeTab === 'addFeedback' ? 'active' : ''}>
                                <span>Add Feedback Form</span>
                            </li>
                            <li onClick={() => setActiveTab('addAttendance')} className={activeTab === 'addAttendance' ? 'active' : ''}>
                                <span>Add Attendance</span>
                            </li>
                            <li onClick={() => setActiveTab('FeedbackReport')} className={activeTab === 'FeedbackReport' ? 'active' : ''}>
                                <span>Genrate Report</span>
                            </li>
                        </ul>
                    )}
                </li>
                <li onClick={() => setActiveTab('photo')} className={activeTab === 'photo' ? 'active' : ''}>
                    <FaCog className="icon" />
                    <span>Upload Photos</span>
                </li>
                <li onClick={() => setActiveTab('feedback')} className={activeTab === 'feedback' ? 'active' : ''}>
                    <FaClipboardList className="icon" />
                    <span>Feedback</span>
                </li>
                <li onClick={() => setActiveTab('analysis')} className={activeTab === 'analysis' ? 'active' : ''}>
                    <FaUserCircle className="icon" />
                    <span>Analysis</span>
                </li>
                <li onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>
                    <FaCog className="icon" />
                    <span>Profile</span>
                </li>
                {/* Add Logout option here */}
                <li onClick={handleLogout} className="logout">
                    <FaUserCircle className="icon" />
                    <span>Logout</span>
                </li>
                
            </ul>
        </aside>
    );
};

export default Sidebar;
