import React, { useState } from 'react';
import Papa from 'papaparse';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const firestore = getFirestore();

const CSVReader = () => {
  const [csvData, setCsvData] = useState([]);

  // Function to handle file upload and parse CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      Papa.parse(file, {
        header: true, // Parse the CSV with headers
        skipEmptyLines: true, // Skip empty lines
        complete: (result) => {
          setCsvData(result.data); // Store parsed data in state
          console.log(result.data); // Log data to check the structure
        }
      });
    }
  };

  // Function to upload CSV data to Firestore
  const uploadToFirestore = async () => {
    try {
      const collectionRef = collection(firestore, 'volunteers'); // Reference to the Firestore collection

      // Loop through CSV data and add each row to Firestore
      csvData.forEach(async (row) => {
        await addDoc(collectionRef, {
          pid: row.pid,
          fullname: row.fullname,
          email: row.email,
          class: row.class,
          phoneno: row.phoneno,
          hoursRegistered: 0 // Add hoursRegistered with a default value of 0
        });
      });

      alert('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading to Firestore:', error);
    }
  };

  return (
    <div>
      <h2>CSV File Reader and Firestore Uploader</h2>

      {/* File input to upload the CSV file */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />

      {/* Display the data in a table */}
      <table border="1" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>PID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Phone No</th>
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, index) => (
            <tr key={index}>
              <td>{row.pid}</td>
              <td>{row.fullname}</td>
              <td>{row.email}</td>
              <td>{row.class}</td>
              <td>{row.phoneno}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to upload data to Firestore */}
      <button 
        onClick={uploadToFirestore} 
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Upload to Firestore
      </button>
    </div>
  );
};

export default CSVReader;
