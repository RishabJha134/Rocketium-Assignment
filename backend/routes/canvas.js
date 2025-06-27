const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/canvasController');
const uploadMiddleware = require('../middleware/upload');

// Initialize canvas with custom dimensions
router.post('/initialize', canvasController.initializeCanvas);

// Add elements to canvas
router.post('/add-rectangle', canvasController.addRectangle);
router.post('/add-circle', canvasController.addCircle);
router.post('/add-text', canvasController.addText);
router.post('/add-image', uploadMiddleware.single('image'), canvasController.addImage);

// Get current canvas state
router.get('/state', canvasController.getCanvasState);

// Clear canvas
router.post('/clear', canvasController.clearCanvas);

// Export canvas as PDF
router.post('/export-pdf', canvasController.exportToPDF);

// Download PDF
router.get('/download/:filename', canvasController.downloadPDF);

module.exports = router;
