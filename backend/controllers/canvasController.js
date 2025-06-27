const { createCanvas, loadImage } = require('canvas');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for canvas state (in production, use a database)
let canvasState = {
    width: 800,
    height: 600,
    elements: []
};

/**
 * Initialize canvas with custom dimensions
 */
const initializeCanvas = async (req, res) => {
    try {
        const { width, height } = req.body;

        // Validation
        if (!width || !height) {
            return res.status(400).json({
                error: 'Width and height are required',
                example: { width: 800, height: 600 }
            });
        }

        if (width < 100 || height < 100 || width > 4000 || height > 4000) {
            return res.status(400).json({
                error: 'Width and height must be between 100 and 4000 pixels'
            });
        }

        // Initialize canvas state
        canvasState = {
            width: parseInt(width),
            height: parseInt(height),
            elements: []
        };

        console.log(`✅ Canvas initialized: ${width}x${height}`);

        res.json({
            success: true,
            message: 'Canvas initialized successfully',
            canvas: {
                width: canvasState.width,
                height: canvasState.height,
                elementsCount: 0
            }
        });
    } catch (error) {
        console.error('Error initializing canvas:', error);
        res.status(500).json({
            error: 'Failed to initialize canvas',
            message: error.message
        });
    }
};

/**
 * Add rectangle to canvas
 */
const addRectangle = async (req, res) => {
    try {
        const { x, y, width, height, color, filled = true } = req.body;

        // Validation
        if (x === undefined || y === undefined || !width || !height) {
            return res.status(400).json({
                error: 'x, y, width, and height are required',
                example: { x: 100, y: 100, width: 200, height: 150, color: '#FF5733', filled: true }
            });
        }

        const rectangle = {
            id: uuidv4(),
            type: 'rectangle',
            x: parseInt(x),
            y: parseInt(y),
            width: parseInt(width),
            height: parseInt(height),
            color: color || '#000000',
            filled: filled,
            timestamp: new Date().toISOString()
        };

        canvasState.elements.push(rectangle);

        console.log(`✅ Rectangle added: ${width}x${height} at (${x}, ${y})`);

        res.json({
            success: true,
            message: 'Rectangle added successfully',
            element: rectangle,
            totalElements: canvasState.elements.length
        });
    } catch (error) {
        console.error('Error adding rectangle:', error);
        res.status(500).json({
            error: 'Failed to add rectangle',
            message: error.message
        });
    }
};

/**
 * Add circle to canvas
 */
const addCircle = async (req, res) => {
    try {
        const { x, y, radius, color, filled = true } = req.body;

        // Validation
        if (x === undefined || y === undefined || !radius) {
            return res.status(400).json({
                error: 'x, y, and radius are required',
                example: { x: 200, y: 200, radius: 50, color: '#33FF57', filled: true }
            });
        }

        const circle = {
            id: uuidv4(),
            type: 'circle',
            x: parseInt(x),
            y: parseInt(y),
            radius: parseInt(radius),
            color: color || '#000000',
            filled: filled,
            timestamp: new Date().toISOString()
        };

        canvasState.elements.push(circle);

        console.log(`✅ Circle added: radius ${radius} at (${x}, ${y})`);

        res.json({
            success: true,
            message: 'Circle added successfully',
            element: circle,
            totalElements: canvasState.elements.length
        });
    } catch (error) {
        console.error('Error adding circle:', error);
        res.status(500).json({
            error: 'Failed to add circle',
            message: error.message
        });
    }
};

/**
 * Add text to canvas
 */
const addText = async (req, res) => {
    try {
        const { x, y, text, fontSize = 20, color = '#000000', fontFamily = 'Arial' } = req.body;

        // Validation
        if (x === undefined || y === undefined || !text) {
            return res.status(400).json({
                error: 'x, y, and text are required',
                example: { x: 100, y: 100, text: 'Hello World!', fontSize: 24, color: '#FF33FF' }
            });
        }

        const textElement = {
            id: uuidv4(),
            type: 'text',
            x: parseInt(x),
            y: parseInt(y),
            text: text.toString(),
            fontSize: parseInt(fontSize),
            color: color,
            fontFamily: fontFamily,
            timestamp: new Date().toISOString()
        };

        canvasState.elements.push(textElement);

        console.log(`✅ Text added: "${text}" at (${x}, ${y})`);

        res.json({
            success: true,
            message: 'Text added successfully',
            element: textElement,
            totalElements: canvasState.elements.length
        });
    } catch (error) {
        console.error('Error adding text:', error);
        res.status(500).json({
            error: 'Failed to add text',
            message: error.message
        });
    }
};

/**
 * Add image to canvas
 */
const addImage = async (req, res) => {
    try {
        const { x, y, width, height } = req.body;
        
        // Validation
        if (!req.file) {
            return res.status(400).json({
                error: 'Image file is required'
            });
        }

        if (x === undefined || y === undefined) {
            return res.status(400).json({
                error: 'x and y coordinates are required'
            });
        }

        const imageElement = {
            id: uuidv4(),
            type: 'image',
            x: parseInt(x),
            y: parseInt(y),
            width: width ? parseInt(width) : null,
            height: height ? parseInt(height) : null,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            timestamp: new Date().toISOString()
        };

        canvasState.elements.push(imageElement);

        console.log(`✅ Image added: ${req.file.originalname} at (${x}, ${y})`);

        res.json({
            success: true,
            message: 'Image added successfully',
            element: imageElement,
            totalElements: canvasState.elements.length
        });
    } catch (error) {
        console.error('Error adding image:', error);
        res.status(500).json({
            error: 'Failed to add image',
            message: error.message
        });
    }
};

/**
 * Get current canvas state
 */
const getCanvasState = async (req, res) => {
    try {
        res.json({
            success: true,
            canvas: canvasState,
            summary: {
                dimensions: `${canvasState.width}x${canvasState.height}`,
                totalElements: canvasState.elements.length,
                elementTypes: canvasState.elements.reduce((acc, el) => {
                    acc[el.type] = (acc[el.type] || 0) + 1;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Error getting canvas state:', error);
        res.status(500).json({
            error: 'Failed to get canvas state',
            message: error.message
        });
    }
};

/**
 * Clear canvas
 */
const clearCanvas = async (req, res) => {
    try {
        const elementsCount = canvasState.elements.length;
        canvasState.elements = [];

        console.log(`✅ Canvas cleared: ${elementsCount} elements removed`);

        res.json({
            success: true,
            message: `Canvas cleared successfully. ${elementsCount} elements removed.`,
            canvas: canvasState
        });
    } catch (error) {
        console.error('Error clearing canvas:', error);
        res.status(500).json({
            error: 'Failed to clear canvas',
            message: error.message
        });
    }
};

/**
 * Export canvas to PDF
 */
const exportToPDF = async (req, res) => {
    try {
        if (canvasState.elements.length === 0) {
            return res.status(400).json({
                error: 'Canvas is empty. Add some elements before exporting.'
            });
        }

        // Create canvas
        const canvas = createCanvas(canvasState.width, canvasState.height);
        const ctx = canvas.getContext('2d');

        // Set white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasState.width, canvasState.height);

        // Draw elements
        for (const element of canvasState.elements) {
            switch (element.type) {
                case 'rectangle':
                    ctx.fillStyle = element.color;
                    ctx.strokeStyle = element.color;
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
                    if (element.filled) {
                        ctx.fill();
                    } else {
                        ctx.stroke();
                    }
                    break;

                case 'text':
                    ctx.fillStyle = element.color;
                    ctx.font = `${element.fontSize}px ${element.fontFamily}`;
                    ctx.fillText(element.text, element.x, element.y);
                    break;

                case 'image':
                    try {
                        const img = await loadImage(element.path);
                        const width = element.width || img.width;
                        const height = element.height || img.height;
                        ctx.drawImage(img, element.x, element.y, width, height);
                    } catch (imgError) {
                        console.error('Error loading image:', imgError);
                    }
                    break;
            }
        }

        // Create PDF
        const pdfFilename = `canvas-export-${Date.now()}.pdf`;
        const pdfPath = path.join(__dirname, '../exports', pdfFilename);

        const doc = new PDFDocument({
            size: [canvasState.width, canvasState.height],
            margin: 0
        });

        // Stream PDF to file
        doc.pipe(fs.createWriteStream(pdfPath));

        // Add canvas image to PDF
        const canvasBuffer = canvas.toBuffer('image/png');
        doc.image(canvasBuffer, 0, 0, {
            width: canvasState.width,
            height: canvasState.height
        });

        doc.end();

        // Wait for PDF to be written
        await new Promise((resolve) => {
            doc.on('end', resolve);
        });

        console.log(`✅ PDF exported: ${pdfFilename}`);

        res.json({
            success: true,
            message: 'Canvas exported to PDF successfully',
            filename: pdfFilename,
            downloadUrl: `/api/canvas/download/${pdfFilename}`,
            fileSize: fs.statSync(pdfPath).size,
            elementsExported: canvasState.elements.length
        });
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        res.status(500).json({
            error: 'Failed to export PDF',
            message: error.message
        });
    }
};

/**
 * Download PDF file
 */
const downloadPDF = async (req, res) => {
    try {
        const { filename } = req.params;
        const pdfPath = path.join(__dirname, '../exports', filename);

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({
                error: 'PDF file not found'
            });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        const stream = fs.createReadStream(pdfPath);
        stream.pipe(res);

        console.log(`📄 PDF downloaded: ${filename}`);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        res.status(500).json({
            error: 'Failed to download PDF',
            message: error.message
        });
    }
};

module.exports = {
    initializeCanvas,
    addRectangle,
    addCircle,
    addText,
    addImage,
    getCanvasState,
    clearCanvas,
    exportToPDF,
    downloadPDF
};
