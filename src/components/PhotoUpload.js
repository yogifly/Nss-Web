import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { storage, db } from '../firebase'; // Make sure this is the correct path to your firebase.js
import './PhotoUpload.css';

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Handle File Input Change
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle Uploading the File and Data to Firebase Storage and Firestore
  const handleUpload = () => {
    if (!file || !title || !description) {
      alert('Please complete all fields and choose a file!');
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Track progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      () => {
        // Get the download URL and save it to Firestore with title and description
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          saveImageData(downloadURL);
        });
      }
    );
  };

  // Save image URL, title, and description to Firestore
  const saveImageData = async (url) => {
    try {
      await addDoc(collection(db, 'images'), {
        imageUrl: url,
        title: title,
        description: description,
        uploadedAt: new Date() // Timestamp for when the image was uploaded
      });
      setFile(null); // Reset the file input after upload
      setTitle('');   // Reset title input
      setDescription(''); // Reset description input
      setProgress(0); // Reset progress bar
      fetchImages();  // Fetch images to display
    } catch (error) {
      console.error('Error saving image data:', error);
    }
  };

  // Fetch images from Firestore
  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'images'));
      const imageList = querySnapshot.docs.map((doc) => doc.data());
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="photo-upload-container">
      <h2>Upload and Display Photos with Details</h2>
      
      {/* Form to Enter Photo Details */}
      <input 
        type="text" 
        placeholder="Enter Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="Enter Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        required 
      />
      <input 
        type="file" 
        onChange={handleFileChange} 
        required 
      />
      <button onClick={handleUpload}>Upload</button>
      
      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: 'green', height: '5px' }}></div>
      {progress > 0 && <p>{progress}%</p>}

      {/* Display uploaded images with details */}
      <div className="image-gallery">
        <h3>Uploaded Images</h3>
        {images.length > 0 ? (
          images.map((imageData, index) => (
            <div key={index} className="image-item">
              <img 
                src={imageData.imageUrl} 
                alt={`Uploaded ${index}`} 
                width="150" 
                height="150" 
                style={{ margin: '10px' }} 
              />
              <h4>{imageData.title}</h4>
              <p>{imageData.description}</p>
            </div>
          ))
        ) : (
          <p>No images uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
