import React, { useState } from 'react';
import { FiSettings, FiSquare, FiCircle, FiType, FiImage, FiDownload } from 'react-icons/fi';
import { HexColorPicker } from 'react-colorful';

const CanvasControls = ({
  canvasState,
  onInitializeCanvas,
  onAddElement,
  onClearCanvas,
  onExportPDF,
  isLoading,
  isBackendConnected
}) => {
  // Canvas settings
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);

  // Rectangle settings
  const [rectX, setRectX] = useState(100);
  const [rectY, setRectY] = useState(100);
  const [rectWidth, setRectWidth] = useState(200);
  const [rectHeight, setRectHeight] = useState(150);
  const [rectColor, setRectColor] = useState('#3b82f6');
  const [rectFilled, setRectFilled] = useState(true);

  // Circle settings
  const [circleX, setCircleX] = useState(200);
  const [circleY, setCircleY] = useState(200);
  const [circleRadius, setCircleRadius] = useState(50);
  const [circleColor, setCircleColor] = useState('#10b981');
  const [circleFilled, setCircleFilled] = useState(true);

  // Text settings
  const [textX, setTextX] = useState(100);
  const [textY, setTextY] = useState(50);
  const [textContent, setTextContent] = useState('Hello World!');
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState('#1e293b');
  const [textFont, setTextFont] = useState('Arial');

  // Image settings
  const [imageX, setImageX] = useState(300);
  const [imageY, setImageY] = useState(100);
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Color picker states
  const [showRectColorPicker, setShowRectColorPicker] = useState(false);
  const [showCircleColorPicker, setShowCircleColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

  // Handle canvas initialization
  const handleInitCanvas = () => {
    onInitializeCanvas(canvasWidth, canvasHeight);
  };

  // Handle adding rectangle
  const handleAddRectangle = () => {
    onAddElement({
      type: 'rectangle',
      x: rectX,
      y: rectY,
      width: rectWidth,
      height: rectHeight,
      color: rectColor,
      filled: rectFilled
    });
  };

  // Handle adding circle
  const handleAddCircle = () => {
    onAddElement({
      type: 'circle',
      x: circleX,
      y: circleY,
      radius: circleRadius,
      color: circleColor,
      filled: circleFilled
    });
  };

  // Handle adding text
  const handleAddText = () => {
    if (!textContent.trim()) {
      alert('Please enter some text');
      return;
    }
    onAddElement({
      type: 'text',
      x: textX,
      y: textY,
      text: textContent,
      fontSize: textSize,
      color: textColor,
      fontFamily: textFont
    });
  };

  // Handle adding image
  const handleAddImage = () => {
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }
    onAddElement({
      type: 'image',
      x: imageX,
      y: imageY,
      width: imageWidth ? parseInt(imageWidth) : null,
      height: imageHeight ? parseInt(imageHeight) : null,
      file: selectedFile
    });
    setSelectedFile(null);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const ColorPicker = ({ color, onChange, isOpen, onToggle }) => (
    <div className="color-picker-wrapper">
      <div
        className="color-preview"
        style={{ backgroundColor: color }}
        onClick={onToggle}
        title={`Current color: ${color}`}
      />
      {isOpen && (
        <div className="color-picker-popup">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="mt-sm text-center">
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="form-input text-center"
              style={{ fontSize: '12px' }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Canvas Settings */}
      <div className="control-section">
        <h3>
          <FiSettings className="icon" />
          Canvas Settings
        </h3>
        <div className="form-group">
          <label>Canvas Size</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="Width"
              value={canvasWidth}
              onChange={(e) => setCanvasWidth(e.target.value)}
              min="100"
              max="4000"
            />
            <input
              type="number"
              className="form-input"
              placeholder="Height"
              value={canvasHeight}
              onChange={(e) => setCanvasHeight(e.target.value)}
              min="100"
              max="4000"
            />
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={handleInitCanvas}
          disabled={isLoading || !isBackendConnected}
        >
          {isLoading ? <div className="spinner" /> : <FiSettings />}
          Initialize Canvas
        </button>
      </div>

      {/* Rectangle Controls */}
      <div className="control-section">
        <h3>
          <FiSquare className="icon" />
          Add Rectangle
        </h3>
        <div className="form-group">
          <label>Position</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="X"
              value={rectX}
              onChange={(e) => setRectX(e.target.value)}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Y"
              value={rectY}
              onChange={(e) => setRectY(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Size</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="Width"
              value={rectWidth}
              onChange={(e) => setRectWidth(e.target.value)}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Height"
              value={rectHeight}
              onChange={(e) => setRectHeight(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Style</label>
          <div className="flex items-center gap-sm">
            <ColorPicker
              color={rectColor}
              onChange={setRectColor}
              isOpen={showRectColorPicker}
              onToggle={() => setShowRectColorPicker(!showRectColorPicker)}
            />
            <label className="flex items-center gap-xs">
              <input
                type="checkbox"
                checked={rectFilled}
                onChange={(e) => setRectFilled(e.target.checked)}
              />
              Filled
            </label>
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={handleAddRectangle}
          disabled={isLoading || !isBackendConnected}
        >
          <FiSquare />
          Add Rectangle
        </button>
      </div>

      {/* Circle Controls */}
      <div className="control-section">
        <h3>
          <FiCircle className="icon" />
          Add Circle
        </h3>
        <div className="form-group">
          <label>Position</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="X"
              value={circleX}
              onChange={(e) => setCircleX(e.target.value)}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Y"
              value={circleY}
              onChange={(e) => setCircleY(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Radius</label>
          <input
            type="number"
            className="form-input"
            placeholder="Radius"
            value={circleRadius}
            onChange={(e) => setCircleRadius(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Style</label>
          <div className="flex items-center gap-sm">
            <ColorPicker
              color={circleColor}
              onChange={setCircleColor}
              isOpen={showCircleColorPicker}
              onToggle={() => setShowCircleColorPicker(!showCircleColorPicker)}
            />
            <label className="flex items-center gap-xs">
              <input
                type="checkbox"
                checked={circleFilled}
                onChange={(e) => setCircleFilled(e.target.checked)}
              />
              Filled
            </label>
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={handleAddCircle}
          disabled={isLoading || !isBackendConnected}
        >
          <FiCircle />
          Add Circle
        </button>
      </div>

      {/* Text Controls */}
      <div className="control-section">
        <h3>
          <FiType className="icon" />
          Add Text
        </h3>
        <div className="form-group">
          <label>Position</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="X"
              value={textX}
              onChange={(e) => setTextX(e.target.value)}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Y"
              value={textY}
              onChange={(e) => setTextY(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Text Content</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter text..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Font Style</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="Size"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
              min="8"
              max="100"
            />
            <select
              className="form-input"
              value={textFont}
              onChange={(e) => setTextFont(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times</option>
              <option value="Courier New">Courier</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <ColorPicker
            color={textColor}
            onChange={setTextColor}
            isOpen={showTextColorPicker}
            onToggle={() => setShowTextColorPicker(!showTextColorPicker)}
          />
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={handleAddText}
          disabled={isLoading || !isBackendConnected}
        >
          <FiType />
          Add Text
        </button>
      </div>

      {/* Image Controls */}
      <div className="control-section">
        <h3>
          <FiImage className="icon" />
          Add Image
        </h3>
        <div className="form-group">
          <label>Position</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="X"
              value={imageX}
              onChange={(e) => setImageX(e.target.value)}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Y"
              value={imageY}
              onChange={(e) => setImageY(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Size (optional)</label>
          <div className="form-row">
            <input
              type="number"
              className="form-input"
              placeholder="Width"
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Height"
              value={imageHeight}
              onChange={(e) => setImageHeight(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Select Image</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              id="imageInput"
            />
            <label htmlFor="imageInput">
              <div className="file-upload-icon">
                <FiImage />
              </div>
              <div className="file-upload-text">
                {selectedFile ? selectedFile.name : 'Click to select image'}
              </div>
            </label>
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={handleAddImage}
          disabled={isLoading || !isBackendConnected || !selectedFile}
        >
          <FiImage />
          Add Image
        </button>
      </div>

      {/* Export Controls */}
      <div className="control-section">
        <button
          className="btn btn-success btn-full btn-lg"
          onClick={onExportPDF}
          disabled={isLoading || !isBackendConnected || canvasState.elements.length === 0}
        >
          {isLoading ? <div className="spinner" /> : <FiDownload />}
          Export as PDF
        </button>
        <div className="text-center mt-sm">
          <small className="text-secondary">
            {canvasState.elements.length} element{canvasState.elements.length !== 1 ? 's' : ''} on canvas
          </small>
        </div>
      </div>
    </div>
  );
};

export default CanvasControls;
