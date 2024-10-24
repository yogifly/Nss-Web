import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure this path is correct
import './Gallery1.css'; // Add your custom styling

const Gallery1 = () => {
  const [images, setImages] = useState([]);

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
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="image-gallery">
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

export default Gallery1;
