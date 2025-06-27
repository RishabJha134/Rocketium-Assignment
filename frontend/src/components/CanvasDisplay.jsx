import React, { useEffect, useRef, forwardRef } from 'react';

const CanvasDisplay = forwardRef(({ canvasState, isLoading }, ref) => {
  const canvasRef = useRef(null);

  // Draw canvas elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    canvasState.elements.forEach((element) => {
      switch (element.type) {
        case 'rectangle':
          ctx.fillStyle = element.color;
          ctx.strokeStyle = element.color;
          ctx.lineWidth = 2;
          if (element.filled) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
          } else {
            ctx.strokeRect(element.x, element.y, element.width, element.height);
          }
          break;

        case 'circle':
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
          ctx.fillStyle = element.color;
          ctx.strokeStyle = element.color;
          ctx.lineWidth = 2;
          if (element.filled) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
          break;

        case 'text':
          ctx.fillStyle = element.color;
          ctx.font = `${element.fontSize}px ${element.fontFamily}`;
          ctx.textBaseline = 'top';
          ctx.fillText(element.text, element.x, element.y);
          break;

        case 'image': {
          // For image preview, we'll show a placeholder
          // The actual image rendering happens on the server side
          ctx.strokeStyle = '#ccc';
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 2;
          const imgWidth = element.width || 100;
          const imgHeight = element.height || 100;
          ctx.strokeRect(element.x, element.y, imgWidth, imgHeight);
          
          // Draw image icon
          ctx.setLineDash([]);
          ctx.fillStyle = '#999';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            '🖼️ Image',
            element.x + imgWidth / 2,
            element.y + imgHeight / 2
          );
          ctx.textAlign = 'start';
          ctx.textBaseline = 'top';
          break;
        }

        default:
          console.warn('Unknown element type:', element.type);
      }
    });
  }, [canvasState]);

  // Update canvas size when canvasState changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasState.width;
      canvas.height = canvasState.height;
    }
  }, [canvasState.width, canvasState.height]);

  // Expose canvas ref to parent
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(canvasRef.current);
      } else {
        ref.current = canvasRef.current;
      }
    }
  }, [ref]);

  return (
    <div className="canvas-container">
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div className="spinner" />
          <span>Processing...</span>
        </div>
      )}
      
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={canvasState.width}
          height={canvasState.height}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            opacity: isLoading ? 0.5 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
      
      <div className="canvas-info">
        <p>
          <strong>Canvas:</strong> {canvasState.width}×{canvasState.height}px
        </p>
        <p>
          <strong>Elements:</strong> {canvasState.elements.length}
        </p>
        {canvasState.elements.length === 0 && (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>
            Add elements using the controls on the left
          </p>
        )}
      </div>
    </div>
  );
});

CanvasDisplay.displayName = 'CanvasDisplay';

export default CanvasDisplay;
