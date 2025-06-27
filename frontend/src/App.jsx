import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSettings, FiDownload, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { canvasAPI, handleAPIError, downloadFile } from './services/api';
import CanvasControls from './components/CanvasControls';
import CanvasDisplay from './components/CanvasDisplay';
import Notification from './components/Notification';
import StatusIndicator from './components/StatusIndicator';
import './styles/App.css';

function App() {
  // Canvas state
  const [canvasState, setCanvasState] = useState({
    width: 800,
    height: 600,
    elements: []
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Canvas ref for drawing
  const canvasRef = useRef(null);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Check if backend is running
  const checkBackendConnection = async () => {
    try {
      await canvasAPI.healthCheck();
      setIsBackendConnected(true);
    } catch (error) {
      setIsBackendConnected(false);
      console.error('Backend connection failed:', error);
    }
  };

  // Show notification
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Initialize canvas
  const handleInitializeCanvas = async (width, height) => {
    try {
      setIsLoading(true);
      const response = await canvasAPI.initializeCanvas(width, height);
      
      setCanvasState({
        width: parseInt(width),
        height: parseInt(height),
        elements: []
      });

      showNotification(`Canvas initialized: ${width}×${height}px`);
      console.log('✅ Canvas initialized:', response);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      showNotification(errorInfo.message, 'error');
      console.error('❌ Failed to initialize canvas:', errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  // Add element to canvas
  const handleAddElement = async (elementData) => {
    try {
      setIsLoading(true);
      let response;

      switch (elementData.type) {
        case 'rectangle':
          response = await canvasAPI.addRectangle(
            elementData.x, elementData.y, elementData.width, elementData.height,
            elementData.color, elementData.filled
          );
          break;
        case 'circle':
          response = await canvasAPI.addCircle(
            elementData.x, elementData.y, elementData.radius,
            elementData.color, elementData.filled
          );
          break;
        case 'text':
          response = await canvasAPI.addText(
            elementData.x, elementData.y, elementData.text,
            elementData.fontSize, elementData.color, elementData.fontFamily
          );
          break;
        case 'image':
          response = await canvasAPI.addImage(
            elementData.x, elementData.y, elementData.file,
            elementData.width, elementData.height
          );
          break;
        default:
          throw new Error('Unknown element type');
      }

      // Refresh canvas state
      await refreshCanvasState();
      showNotification(`${elementData.type.charAt(0).toUpperCase() + elementData.type.slice(1)} added successfully`);
      console.log('✅ Element added:', response);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      showNotification(errorInfo.message, 'error');
      console.error('❌ Failed to add element:', errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear canvas
  const handleClearCanvas = async () => {
    try {
      setIsLoading(true);
      const response = await canvasAPI.clearCanvas();
      
      setCanvasState(prev => ({
        ...prev,
        elements: []
      }));

      showNotification('Canvas cleared successfully');
      console.log('✅ Canvas cleared:', response);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      showNotification(errorInfo.message, 'error');
      console.error('❌ Failed to clear canvas:', errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    try {
      setIsLoading(true);
      
      if (canvasState.elements.length === 0) {
        showNotification('Canvas is empty. Add some elements before exporting.', 'warning');
        return;
      }

      const response = await canvasAPI.exportToPDF();
      
      // Download the PDF
      const pdfBlob = await canvasAPI.downloadPDF(response.filename);
      downloadFile(pdfBlob, response.filename);

      showNotification(`PDF exported successfully: ${response.filename}`);
      console.log('✅ PDF exported:', response);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      showNotification(errorInfo.message, 'error');
      console.error('❌ Failed to export PDF:', errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh canvas state from backend
  const refreshCanvasState = async () => {
    try {
      const response = await canvasAPI.getCanvasState();
      setCanvasState(response.canvas);
      console.log('✅ Canvas state refreshed:', response);
    } catch (error) {
      console.error('❌ Failed to refresh canvas state:', error);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">Canvas Builder</h1>
            <p className="app-subtitle">Create canvases, add elements, export as PDF</p>
          </div>
          <div className="flex items-center gap-md">
            <StatusIndicator isConnected={isBackendConnected} />
            <button 
              className="btn btn-outline"
              onClick={checkBackendConnection}
              disabled={isLoading}
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="canvas-builder">
          {/* Controls Panel */}
          <div className="controls-panel">
            <CanvasControls
              canvasState={canvasState}
              onInitializeCanvas={handleInitializeCanvas}
              onAddElement={handleAddElement}
              onClearCanvas={handleClearCanvas}
              onExportPDF={handleExportPDF}
              isLoading={isLoading}
              isBackendConnected={isBackendConnected}
            />
          </div>

          {/* Canvas Area */}
          <div className="canvas-area">
            <div className="flex items-center justify-between mb-lg">
              <h2>Canvas Preview</h2>
              <div className="flex items-center gap-sm">
                <span className="text-sm text-secondary">
                  {canvasState.elements.length} element{canvasState.elements.length !== 1 ? 's' : ''}
                </span>
                <button
                  className="btn btn-warning"
                  onClick={handleClearCanvas}
                  disabled={isLoading || canvasState.elements.length === 0}
                >
                  <FiTrash2 />
                  Clear
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleExportPDF}
                  disabled={isLoading || canvasState.elements.length === 0}
                >
                  <FiDownload />
                  Export PDF
                </button>
              </div>
            </div>
            
            <CanvasDisplay
              ref={canvasRef}
              canvasState={canvasState}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
