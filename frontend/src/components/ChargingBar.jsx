import React from 'react';
import './ChargingBar.css';

export default function ChargingBar({ progress = 0, label = '' }) {
  return (
    <div className="charging-bar-container">
      {label && <div className="charging-bar-label">{label}</div>}
      <div className="charging-bar-outer">
        <div
          className="charging-bar-inner"
          style={{ width: `${progress}%` }}
        >
          <div className="charging-bar-glow" />
        </div>
      </div>
    </div>
  );
} 