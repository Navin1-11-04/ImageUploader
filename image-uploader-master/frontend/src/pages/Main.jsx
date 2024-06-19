import React, { useState } from 'react';
import '../styles/main.css';
import imageupload from '../assets/image-upload-svg.svg';

function Main() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Send image file to backend for upload
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://image-uploader-server-two.vercel.app/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        console.log('Uploaded to Cloudinary:', data);
        setCloudinaryUrl(data.url); // Save Cloudinary URL
        setIsUploading(false);
        setUploadComplete(true);
        alert('Image uploaded successfully!');

      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
        setIsUploading(false);
      }
      startUploadSimulation();
    } else {
      alert("Please upload a valid image file (Jpeg, Png)");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      startUploadSimulation();
    } else {
      alert("Please upload a valid image file (Jpeg, Png)");
    }
  };
  
  const startUploadSimulation = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    const interval = setInterval(() => {
      setUploadProgress(prevProgress => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          alert('Image uploaded successfully!');
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handleCopyLink = () => {
    if (cloudinaryUrl) {
      navigator.clipboard.writeText(cloudinaryUrl)
        .then(() => {
          alert('Copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          alert('Failed to copy link');
        });
    }
  };

  const renderUploadingUI = () => (
    <div className="uploading-container">
      <p id='uploading-title'>Uploading...</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
      </div>
    </div>
  );

  const renderSuccessUI = () => (
    <div className="success-container">
      <div className='success-conatiner-top'>
        <i className="fa-solid fa-circle-check" style={{ fontSize: "42px", color: "#219653" }}></i>
        <span>Uploaded Successfully!</span>
      </div>
      <img src={preview} alt="uploaded-preview" id='success-preview'/>
      <div className="success-link-container">
        <span id='copy-link'>{cloudinaryUrl}</span>
        <button id='copy-btn' onClick={handleCopyLink}>Copy Link</button>
      </div>
    </div>
  );

  const renderFormUI = () => (
    <div className="main-container">
      <form action="#" className='form'>
        <h2 id='form-title'>Upload your image</h2>
        <p id='form-subtitle'>File should be Jpeg, Png,...</p>
        <div className="main-subcontainer">
          <div 
            className={`image-uploader ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="uploaded-preview" id='upload-preview'/>
            ) : (
              <img src={imageupload} alt="upload-icon" id='upload-icon'/>
            )}
            <p id='form-description'>Drag & Drop your image here</p>
            <input 
              type="file" 
              accept="image/*" 
              id="file-input" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />
          </div>
          <span id='spacer'>Or</span>
        </div>
        <label htmlFor="file-input" className='submit-btn'>Choose a file</label>
      </form>
    </div>
  );

  return (
    <div className='main-wrapper'>
      {isUploading ? renderUploadingUI() : (uploadComplete ? renderSuccessUI() : renderFormUI())}
      <div className='footer'>
        created by <span id='username'>Navin kumar R </span>- devChallenges.io
      </div>
    </div>
  );
}

export default Main;
