# Exported PDFs Directory

This directory stores generated PDF files from canvas exports.

## File Naming Convention
- Format: `canvas-export-{timestamp}.pdf`
- Example: `canvas-export-1703764800000.pdf`

## Features
- High-quality PDF generation
- Optimized file size
- Exact canvas dimensions preserved
- All elements (shapes, text, images) included

## Cleanup
Files older than 7 days are automatically cleaned up (implement cleanup script as needed).

## Download
PDFs can be downloaded via the API endpoint:
`GET /api/canvas/download/{filename}`
