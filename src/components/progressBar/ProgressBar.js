import React from 'react';
import './ProgressBar.css'; 

const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percent}%` }}></div>
    </div>
  );
};

export default ProgressBar;
