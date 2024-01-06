import React from 'react';
import './LoadingSpinner.css'; // Add a corresponding CSS file for styling

function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;