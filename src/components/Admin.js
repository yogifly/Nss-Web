import React from 'react';
import './Admin.css';

function Admin() {
  return (
    <div className="admin-container">
      {/* Fixed Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Admin Dashboard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/add-head">Add Head</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/head/head-list">Manage heads</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <div className="content">
        <h1>Welcome Admin</h1>
        <p>This is the admin dashboard.</p>
      </div>
    </div>
  );
}

export default Admin;
