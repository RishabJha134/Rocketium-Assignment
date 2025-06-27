import React, { useEffect } from 'react';
import { FiX, FiCheck, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const Notification = ({ message, type = 'success', onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck />;
      case 'error':
        return <FiX />;
      case 'warning':
        return <FiAlertTriangle />;
      default:
        return <FiInfo />;
    }
  };

  const getClassName = () => {
    const baseClass = 'notification';
    switch (type) {
      case 'success':
        return `${baseClass} notification-success`;
      case 'error':
        return `${baseClass} notification-error`;
      case 'warning':
        return `${baseClass} notification-warning`;
      default:
        return `${baseClass} notification-info`;
    }
  };

  return (
    <div className={getClassName()}>
      <div className="flex items-center gap-sm">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          {message}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default Notification;
