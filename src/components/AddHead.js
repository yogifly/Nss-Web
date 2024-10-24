import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore'; 
import './AddHead.css';

const AddHead = () => {
  const [pid, setPid] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [className, setClassName] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [message, setMessage] = useState('');  // To show success/error messages
  const [hoursRegistered] = useState(0); // New state variable with a default value of 0

  const firestore = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from refreshing the page

    // Basic validation
    if (!pid || !fullname || !email || !className || !phoneno) {
      setMessage('All fields are required!');
      return;
    }

    if (!/^\d{10}$/.test(phoneno)) {
      setMessage('Phone number must be 10 digits!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email!');
      return;
    }

    try {
      const headsCollectionRef = collection(firestore, 'heads');
      await addDoc(headsCollectionRef, {
        pid,
        fullname,
        email,
        class: className,
        phoneno,
        hoursRegistered // Include the hoursRegistered field with default value 0
      });

      setMessage('Head added successfully!');
      console.log('Head added successfully');

      // Clear the form fields
      setPid('');
      setFullname('');
      setEmail('');
      setClassName('');
      setPhoneno('');
    } catch (error) {
      console.error('Error adding head details: ', error.message);
      setMessage(`Error adding head details: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Head Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          placeholder="PID"
          required
        />
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class"
          required
        />
        <input
          type="text"
          value={phoneno}
          onChange={(e) => setPhoneno(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <button type="submit">Add Head</button>
      </form>
      {message && <p className={`message ${message.includes('Error') ? '' : 'success'}`}>{message}</p>}  {/* Show success or error messages */}
    </div>
  );
};

export default AddHead;
