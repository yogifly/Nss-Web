import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const firestore = getFirestore();

const AddVolunteer = () => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const fileInputRef = useRef(null);

  // Handle drag-and-drop and file selection
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      parseCSV(droppedFile);
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      parseCSV(selectedFile);
      setFile(selectedFile);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setCsvData(result.data);
        console.log(result.data); // Log data to check the structure
      }
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
    setCsvData([]); // Reset CSV data when removing file
  };

  const uploadToFirestore = async () => {
    try {
      const collectionRef = collection(firestore, 'volunteers');
      for (const row of csvData) {
        await addDoc(collectionRef, {
          pid: row.pid,
          fullname: row.fullname,
          email: row.email,
          class: row.class,
          phoneno: row.phoneno,
          hoursRegistered: 0
        });
      }
      alert('Data uploaded successfully!');
      // Clear state after successful upload
      handleRemoveFile();
    } catch (error) {
      console.error('Error uploading to Firestore:', error);
    }
  };
  

  const styles = {
    modal: {
      width: '90%',
      maxWidth: '500px',
      backgroundColor: '#FFF',
      borderRadius: '8px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
      padding: '2rem',
      position: 'relative',
      fontFamily: '"Roboto", sans-serif',
      
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    uploadArea: {
      border: '2px dashed #2e44ff',
      borderRadius: '8px',
      padding: '3rem',
      textAlign: 'center',
      color: '#6a6b76',
      marginTop: '1.25rem',
      transition: 'border 0.3s ease',
    },
    uploadAreaHover: {
      border: '2px dashed #1a2bff',
      backgroundColor: '#f0f8ff', // Light background when hovering
    },
    btn: {
      padding: '0.5rem 1rem',
      fontWeight: '500',
      border: '2px solid #e5e5e5',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '1rem',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    btnPrimary: {
      backgroundColor: '#2e44ff',
      color: '#FFF',
      borderColor: '#2e44ff',
    },
    btnCancel: {
      backgroundColor: '#FFF',  // White background
      color: '#000',            // Black text
      border: '2px solid #e5e5e5',
    },
    table: {
      marginTop: '20px',
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f1f1f1',
      color: '#333',
      padding: '10px',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #e5e5e5',
    },
    icon: {
      fontSize: '3rem',
      color: '#2e44ff',
      marginBottom: '0.5rem',
    },
    iconWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#e0e0e0', // Light grey background
      margin: '0 auto 1rem', // Center the icon with some bottom margin
    },

    footer: {
      marginTop: '20px',
      textAlign: 'right',
    },
    bold: {
      fontWeight: 'bold',
      color:"grey",
    },
    strong: {
      fontWeight: 'bold',
    },
    uploadIcon: {
      fontSize: '2rem',
      color: '#2e44ff',
      marginBottom: '1rem',
    },
  };

  return (
    <div style={styles.modal}>
      <div style={styles.icon}>
        <i className="fas fa-folder-open"></i> {/* Folder Icon */}
      </div>
      <h6 style={styles.strong}>Upload a Volunteer File</h6>
      <h6 style={styles.bold}>Attach a file below </h6>
      <div
        style={styles.uploadArea}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <i className="fas fa-upload" style={styles.uploadIcon}></i><br/> {/* Upload Icon */}
        {file ? (
          <div>
            <span>{file.name}</span>
            <button onClick={handleRemoveFile} style={{ ...styles.btn, ...styles.btnCancel }}>
              Remove File
            </button>
          </div>
        ) : (
          <>
            <span style={styles.bold}>Drag file(s) here to upload</span>
            <div style={styles.bold}>or click to select a file.</div>
          </>
        )}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>PID</th>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Class</th>
            <th style={styles.th}>Phone No</th>
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, index) => (
            <tr key={index}>
              <td style={styles.td}>{row.pid}</td>
              <td style={styles.td}>{row.fullname}</td>
              <td style={styles.td}>{row.email}</td>
              <td style={styles.td}>{row.class}</td>
              <td style={styles.td}>{row.phoneno}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cancel and Upload Buttons */}
      <div style={styles.footer}>
        <button onClick={handleRemoveFile} style={{ ...styles.btn, ...styles.btnCancel }}>
          Cancel
        </button>
        <button onClick={uploadToFirestore} style={{ ...styles.btn, ...styles.btnPrimary }}>
          Upload 
        </button>
      </div>
    </div>
  );
};

export default AddVolunteer;