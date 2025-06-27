import React from 'react';

const StatusIndicator = ({ isConnected }) => {
  return (
    <div className={`status-indicator ${isConnected ? 'status-online' : 'status-offline'}`}>
      <div className="status-dot" />
      <span>
        Backend {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default StatusIndicator;
